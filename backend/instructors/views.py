from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Instructor
from .serializers import (
    InstructorCreateSerializer,
    InstructorReadSerializer,
    InstructorBasicSerializer,
    InstructorUpdateSerializer
)

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return InstructorCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return InstructorUpdateSerializer
        elif self.action == 'retrieve':
            return InstructorReadSerializer
        return InstructorBasicSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            instructor = serializer.save()
            
            response_serializer = InstructorBasicSerializer(instructor)
            headers = self.get_success_headers(response_serializer.data)
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=kwargs.pop('partial', False))
            serializer.is_valid(raise_exception=True)
            instructor = serializer.save()
            
            response_serializer = InstructorBasicSerializer(instructor)
            return Response(response_serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )