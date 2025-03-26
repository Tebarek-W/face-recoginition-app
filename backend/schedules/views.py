from rest_framework import viewsets, permissions
from .models import Schedule
from .serializers import ScheduleSerializer
from .permissions import IsHeadOfDepartment  # Custom permission to restrict access to HoD

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, IsHeadOfDepartment]

    def perform_create(self, serializer):
        # Automatically set the course's department to the HoD's department
        serializer.save()