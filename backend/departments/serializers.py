from rest_framework import serializers
from .models import Department
from django.contrib.auth import get_user_model
from authentication.serializers import UserSerializer

User = get_user_model()

class DepartmentUserSerializer(serializers.ModelSerializer):
    """
    Simplified user serializer for department relationships
    (to avoid password and other sensitive fields)
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        read_only_fields = ['id', 'username', 'email', 'role']

class DepartmentSerializer(serializers.ModelSerializer):
    head_of_department = DepartmentUserSerializer(read_only=True)
    head_of_department_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='HEAD'),
        source='head_of_department',
        write_only=True,
        required=False,
        allow_null=True
    )
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Department
        fields = [
            'id', 
            'name', 
            'head_of_department',
            'head_of_department_id',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'head_of_department']

    def validate_name(self, value):
        """Ensure department name is unique (case insensitive)"""
        qs = Department.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Department with this name already exists.")
        return value