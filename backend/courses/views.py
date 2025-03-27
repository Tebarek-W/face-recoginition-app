from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Course
from .serializers import CourseReadSerializer, CourseWriteSerializer

class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    # Add this base queryset for router registration
    queryset = Course.objects.none()  # Will be overridden by get_queryset()
    
    def get_queryset(self):
        queryset = Course.objects.select_related(
            'department',
            'instructor',
            'instructor__user'
        ).all()
        
        # Filter by department if user is department head
        if hasattr(self.request.user, 'department'):
            return queryset.filter(department=self.request.user.department)
        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CourseWriteSerializer
        return CourseReadSerializer

    @action(detail=False, methods=['options'])
    def options(self, request, *args, **kwargs):
        response = super().options(request, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = request.headers.get('Origin')
        response['Access-Control-Allow-Credentials'] = 'true'
        return response