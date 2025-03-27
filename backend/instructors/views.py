from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Instructor
from .serializers import InstructorReadSerializer, InstructorWriteSerializer  # Updated imports
from .permissions import IsHeadOfDepartment

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.select_related('user', 'department').all()
    

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return InstructorWriteSerializer
        return InstructorReadSerializer

    def perform_create(self, serializer):
        serializer.save(department=self.request.user.department)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)