from rest_framework import serializers
from .models import FacialData

class FacialDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacialData
        fields = ['id', 'user', 'facial_features', 'created_at', 'updated_at']