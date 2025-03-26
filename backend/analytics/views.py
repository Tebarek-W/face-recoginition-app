from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from attendance.models import AttendanceRecord

class AttendanceAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        student_id = request.query_params.get('student_id')
        
        # If the user is a student, restrict access to their own data
        if request.user.role == 'Student':
            student_id = request.user.student.id  # Assuming the student profile is linked to the user

        # If the user is HoD or instructor, allow access to any student's data
        elif request.user.role not in ['HoD', 'Instructor']:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=403
            )

        # Calculate attendance analytics
        attendance_records = AttendanceRecord.objects.filter(student_id=student_id)
        total_classes = attendance_records.count()
        present_classes = attendance_records.filter(status='Present').count()
        attendance_percentage = (present_classes / total_classes) * 100 if total_classes > 0 else 0

        return Response({
            'student_id': student_id,
            'total_classes': total_classes,
            'present_classes': present_classes,
            'attendance_percentage': attendance_percentage
        })