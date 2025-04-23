from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from .models import FacialData
from .liveness import LivenessDetector
from students.models import Student
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class LivenessVerificationAPI(APIView):
    def post(self, request):
        """
        Verifies student liveness via optional video.
        Expects a video. Student is auto-detected (most recently created).
        """

        video_file = request.FILES.get('video')

        try:
            # Automatically pick the most recently added student
            student = Student.objects.latest('created_at')  # Ensure 'created_at' exists on Student model
        except Student.DoesNotExist:
            return Response(
                {"error": "No student found to verify.", "verified": False},
                status=status.HTTP_404_NOT_FOUND
            )

        # Manual verification (no video)
        if not video_file:
            student.is_verified = True
            student.save()

            FacialData.objects.update_or_create(
                student=student,
                defaults={
                    'is_verified': True,
                    'analysis_results': {"note": "Verified without video"},
                    'video': None
                }
            )

            return Response({
                "status": "success",
                "message": "Student verified without video",
                "student_id": student.student_id,
                "verified": True
            }, status=status.HTTP_200_OK)

        # Liveness verification using video
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_video_path = f"temp_liveness_{student.student_id}_{timestamp}.webm"

        try:
            # Save the uploaded video temporarily
            with default_storage.open(temp_video_path, 'wb+') as destination:
                for chunk in video_file.chunks():
                    destination.write(chunk)

            detector = LivenessDetector()
            results = detector.analyze_video(default_storage.path(temp_video_path))

            if results.get('is_verified'):
                facial_data, _ = FacialData.objects.update_or_create(
                    student=student,
                    defaults={
                        'video': video_file,
                        'is_verified': True,
                        'analysis_results': results
                    }
                )
                student.is_verified = True
                student.save()

                return Response({
                    "status": "success",
                    "student_id": student.student_id,
                    "facial_data_id": facial_data.id,
                    "analysis_results": results,
                    "verified": True
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "status": "failed",
                    "reason": "Liveness verification failed",
                    "details": results,
                    "verified": False
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception("Error in liveness verification")
            return Response(
                {"error": f"Internal server error: {str(e)}", "verified": False},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        finally:
            # Always clean up the temporary video file
            if default_storage.exists(temp_video_path):
                default_storage.delete(temp_video_path)
