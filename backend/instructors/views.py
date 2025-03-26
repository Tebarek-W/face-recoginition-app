from rest_framework import viewsets, permissions
from .models import Instructor
from .serializers import InstructorSerializer
from .permissions import IsHeadOfDepartment  # Custom permission to restrict access to HoD

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [permissions.IsAuthenticated, IsHeadOfDepartment]

    def perform_create(self, serializer):
        # Automatically set the department to the HoD's department
        serializer.save(department=self.request.user.department)