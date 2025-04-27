from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student
from .serializers import StudentRegistrationSerializer, StudentSerializer
from facial_data.views import LivenessVerificationAPI
from facial_data.utils import process_liveness_images
from facial_data.models import FacialData  # ✨ Added this
from django.shortcuts import get_object_or_404
import logging
from django.db import transaction  # ✨ Optional: To handle atomic operations

logger = logging.getLogger(__name__)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'student_id'

    def create(self, request, *args, **kwargs):
        """
        Enhanced create method to handle student registration with optional liveness check
        and capture associated facial data.
        """
        try:
            with transaction.atomic():  # ✨ Make it atomic (optional but recommended)
                serializer = StudentRegistrationSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                student = serializer.save()

                # Handle liveness verification if images are present
                liveness_images = {
                    k: v for k, v in request.FILES.items() if k.startswith('liveness_')
                }
                if liveness_images:
                    verification = process_liveness_images(liveness_images)
                    if not verification.get('is_verified', False):
                        student.delete()
                        logger.warning(f"Liveness verification failed for student {student.student_id}")
                        return Response(
                            {"error": "Liveness verification failed", "details": verification},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # ✨ After successful liveness, create FacialData linked to this student
                    FacialData.objects.create(
                        student=student,
                        is_verified=True,  # or verification.get('is_verified', True)
                        analysis_results=verification.get('analysis_results', {})
                    )

                response_serializer = StudentSerializer(student)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Student creation error: {str(e)}", exc_info=True)
            return Response(
                {"error": "Student registration failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def verify_liveness(self, request, student_id=None):
        """
        Video-based liveness verification endpoint
        """
        try:
            student = self.get_object()  # will auto 404 if not found
            liveness_api = LivenessVerificationAPI()
            response = liveness_api.post(request)

            if response.status_code == status.HTTP_200_OK and response.data.get('is_verified'):
                student.is_verified = True
                student.save()

            return response

        except Exception as e:
            logger.error(f"Liveness verification error for student {student_id}: {str(e)}", exc_info=True)
            return Response(
                {"error": "Liveness verification failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def verification_status(self, request, student_id=None):
        """
        Endpoint to check student's verification status
        """
        student = self.get_object()
        return Response({
            "student_id": student.student_id,
            "is_verified": student.is_verified
        })
