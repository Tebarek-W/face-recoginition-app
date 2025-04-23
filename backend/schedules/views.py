from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Schedule
from .serializers import ScheduleSerializer, CreateScheduleSerializer
from datetime import datetime

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all().order_by('day', 'start_time')
    
    def get_serializer_class(self):
        """
        Use CreateScheduleSerializer for write operations,
        and ScheduleSerializer for read operations
        """
        if self.action in ['create', 'update', 'partial_update']:
            return CreateScheduleSerializer
        return ScheduleSerializer

    def create(self, request, *args, **kwargs):
        """
        Enhanced create method with better debugging
        """
        print("Received POST data:", request.data)  # Debug incoming data
        
        # Convert time strings to proper format if needed
        data = request.data.copy()
        
        try:
            # Handle time format conversion
            for time_field in ['start_time', 'end_time']:
                if time_field in data and isinstance(data[time_field], str):
                    if len(data[time_field].split(':')) == 2:  # HH:MM format
                        data[time_field] = f"{data[time_field]}:00"
            
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            
            # Debug output
            print("Successfully created schedule:", serializer.data)
            
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
            
        except Exception as e:
            # Detailed error logging
            print("Schedule creation failed:", str(e))
            print("Validation errors:", serializer.errors if hasattr(serializer, 'errors') else None)
            error_data = {
                'error': str(e),
                'validation_errors': serializer.errors if hasattr(serializer, 'errors') else None
            }
            return Response(error_data, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        """
        Enhanced list method with query debugging
        """
        print("Fetching schedules with params:", request.query_params)
        return super().list(request, *args, **kwargs)