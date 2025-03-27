# views.py
from rest_framework import viewsets
from .models import Schedule
from .serializers import ScheduleSerializer, CreateScheduleSerializer
from rest_framework.response import Response

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CreateScheduleSerializer
        return ScheduleSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)