from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Department
from .serializers import DepartmentSerializer
from .permissions import IsAdmin
from users.models import User

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().select_related('head_of_department')
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'

    def get_queryset(self):
        """Optimized queryset with prefetching"""
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        """Custom create with better error handling"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """Custom update with partial support"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def set_head(self, request, id=None):
        """Special endpoint for just updating the head"""
        department = self.get_object()
        head_id = request.data.get('head_of_department_id')
        
        if head_id is None:
            department.head_of_department = None
            department.save()
            return Response(self.get_serializer(department).data)
        
        try:
            head = User.objects.get(id=head_id, role='HEAD')
            department.head_of_department = head
            department.save()
            return Response(self.get_serializer(department).data)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found or not a department head"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['delete'])
    def remove_head(self, request, id=None):
        """Remove head from department"""
        department = self.get_object()
        department.head_of_department = None
        department.save()
        return Response(self.get_serializer(department).data)