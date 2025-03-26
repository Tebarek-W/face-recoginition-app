from rest_framework import viewsets, permissions
from .models import Student
from .serializers import StudentSerializer
from .permissions import IsHeadOfDepartment  # Custom permission to restrict access to HoD

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated, IsHeadOfDepartment]

    def get_queryset(self):
        # Only allow HoD to access student records in their department
        if self.request.user.role == 'HoD':
            return Student.objects.filter(department=self.request.user.department)
        return Student.objects.none()

    def perform_create(self, serializer):
        # Automatically set the department to the HoD's department
        serializer.save(department=self.request.user.department)