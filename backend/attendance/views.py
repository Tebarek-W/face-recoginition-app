from rest_framework import viewsets, permissions
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer
from .permissions import IsInstructor  # Custom permission to restrict access to instructors

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]

    def get_queryset(self):
        # Only allow instructors to access attendance records for their courses
        return AttendanceRecord.objects.filter(schedule__instructor__user=self.request.user)