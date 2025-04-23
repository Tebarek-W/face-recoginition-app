from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student
from .serializers import StudentRegistrationSerializer, StudentSerializer
from facial_data.utils import process_liveness_images
import logging

logger = logging.getLogger(__name__)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'student_id'

    def create(self, request, *args, **kwargs):
        """
        Enhanced create method to handle student registration with optional liveness check
        """
        try:
            # Step 1: Register the student using custom serializer for registration
            serializer = StudentRegistrationSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            student = serializer.save()  # Saves both Student and User objects

            # Step 2: Handle liveness verification if images are present
            liveness_images = {
                k: v for k, v in request.FILES.items() if k.startswith('liveness_')
            }
            if liveness_images:
                verification = process_liveness_images(liveness_images)
                if not verification.get('is_verified', False):
                    # If liveness verification fails, delete student and return error
                    student.delete()
                    return Response(
                        {"error": "Liveness verification failed", "details": verification},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Step 3: Return the response with the serialized student data
            response_serializer = StudentSerializer(student)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Student creation error: {str(e)}", exc_info=True)
            return Response(
                {"error": "Student registration failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def verify_liveness(self, request, student_id=None):
        """
        Video-based liveness verification endpoint
        """
        try:
            from facial_data.views import LivenessVerificationAPI
            liveness_api = LivenessVerificationAPI()
            response = liveness_api.post(request)
            
            # Update student verification status if successful
            if response.status_code == status.HTTP_200_OK and response.data.get('is_verified'):
                student = self.get_object()
                student.is_verified = True
                student.save()
            
            return response
            
        except Exception as e:
            logger.error(f"Liveness verification error: {str(e)}", exc_info=True)
            return Response(
                {"error": "Liveness verification failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def verification_status(self, request, student_id=None):
        """
        Simple endpoint to check verification status
        """
        student = self.get_object()
        return Response({
            "is_verified": student.is_verified,
            "student_id": student.student_id
        })
