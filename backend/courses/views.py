from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Course
from .serializers import CourseReadSerializer, CourseWriteSerializer
import logging

logger = logging.getLogger(__name__)

class CourseViewSet(viewsets.ModelViewSet):
    """
    Course ViewSet with enhanced update handling and debugging
    """
    queryset = Course.objects.none()  # Base queryset for router registration
    
    def get_queryset(self):
        """
        Returns filtered queryset based on user permissions
        """
        queryset = Course.objects.select_related('department').all()
        
        # Filter by department if user is department head
        if hasattr(self.request.user, 'department'):
            logger.info(f"Filtering courses for department head: {self.request.user.department}")
            return queryset.filter(department=self.request.user.department)
        
        logger.debug("Returning unfiltered course queryset")
        return queryset

    def get_serializer_class(self):
        """
        Returns appropriate serializer based on action
        """
        if self.action in ['create', 'update', 'partial_update']:
            return CourseWriteSerializer
        return CourseReadSerializer

    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        """
        Handles PATCH requests with explicit field updates and transaction safety
        """
        instance = self.get_object()
        data = request.data.copy()
        
        logger.info(
            f"Starting course update for ID {instance.id}\n"
            f"Current data: {instance.__dict__}\n"
            f"Incoming data: {data}"
        )

        # Process department_id separately
        if 'department_id' in data:
            if data['department_id'] in ['', None]:
                logger.debug("Setting department to None")
                instance.department = None
            else:
                logger.debug(f"Setting department_id to {data['department_id']}")
                instance.department_id = data['department_id']

        # Process other fields
        field_updates = {}
        for field in ['code', 'name', 'credit_hours']:
            if field in data:
                field_updates[field] = data[field]
                setattr(instance, field, data[field])

        if not field_updates and 'department_id' not in data:
            logger.warning("No valid fields provided for update")
            return Response(
                {'detail': 'No valid fields provided for update'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Force update timestamp
        instance.updated_at = timezone.now()
        
        try:
            instance.save()
            logger.info(
                f"Successfully updated course {instance.id}\n"
                f"New data: {instance.__dict__}"
            )
            return Response(CourseReadSerializer(instance).data)
        
        except Exception as e:
            logger.error(
                f"Failed to update course {instance.id}\n"
                f"Error: {str(e)}\n"
                f"Data attempted: {data}"
            )
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['options'])
    def options(self, request, *args, **kwargs):
        """
        Handles OPTIONS requests for CORS preflight
        """
        response = super().options(request, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = request.headers.get('Origin')
        response['Access-Control-Allow-Credentials'] = 'true'
        return response

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Additional endpoint: Get update history for a course
        """
        instance = self.get_object()
        return Response({
            'created_at': instance.created_at,
            'updated_at': instance.updated_at,
            'version_history': []  # Could integrate with django-simple-history
        })