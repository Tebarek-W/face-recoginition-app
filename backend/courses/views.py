from rest_framework import viewsets, permissions
from .models import Course
from .serializers import CourseSerializer
from .permissions import IsHeadOfDepartment  # Custom permission to restrict access to HoD

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsHeadOfDepartment]

    def perform_create(self, serializer):
        # Automatically set the department to the HoD's department
        serializer.save(department=self.request.user.department)