from rest_framework import viewsets, permissions
from .models import FacialData
from .serializers import FacialDataSerializer

class FacialDataViewSet(viewsets.ModelViewSet):
    queryset = FacialData.objects.all()
    serializer_class = FacialDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow users to access their own facial data
        return FacialData.objects.filter(user=self.request.user)