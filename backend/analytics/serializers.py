from rest_framework import serializers
from .models import AttendanceRule

class AttendanceRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRule
        fields = [
            'id',
            'minimum_attendance',
            'late_policy',
            'notification_threshold',
            'grace_period',
            'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']

    def validate(self, data):
        """Business rule validation"""
        if data['notification_threshold'] >= data['minimum_attendance']:
            raise serializers.ValidationError({
                'notification_threshold': 'Must be less than minimum attendance'
            })
        
        if any(value < 0 for value in data.values()):
            raise serializers.ValidationError("All values must be positive")
            
        return data