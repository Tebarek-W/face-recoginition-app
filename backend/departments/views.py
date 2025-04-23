from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Department
from .serializers import DepartmentSerializer
from users.models import User

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().select_related('head_of_department')
    serializer_class = DepartmentSerializer
    permission_classes = []  # No permissions required
    lookup_field = 'id'

    # Remove custom create/update methods unless you need special behavior
    # The default ModelViewSet methods will work fine for standard CRUD

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