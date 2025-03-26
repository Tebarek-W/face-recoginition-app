from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role']

    @action(detail=False, methods=['get'])
    def get_heads(self, request):
        """Special endpoint for department heads"""
        heads = User.objects.filter(role='HEAD').only('id', 'name')
        serializer = self.get_serializer(heads, many=True)
        return Response(serializer.data)