from rest_framework import serializers
from .models import FacialData

class FacialDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacialData
        fields = '__all__'
        read_only_fields = ('student', 'created_at', 'updated_at')

class LivenessVerificationSerializer(serializers.Serializer):
    video = serializers.FileField(required=True)
    student_id = serializers.IntegerField(required=True)