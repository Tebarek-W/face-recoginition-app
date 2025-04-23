from rest_framework import serializers
from .models import Department
from django.contrib.auth import get_user_model
from users.serializers import UserBasicSerializer

User = get_user_model()

class DepartmentBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']
        read_only_fields = fields

class DepartmentSerializer(serializers.ModelSerializer):
    head_of_department = UserBasicSerializer(read_only=True)
    head_of_department_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='HEAD'),
        source='head_of_department',
        write_only=True,
        required=False,
        allow_null=True
    )

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
        extra_kwargs = {
            'name': {'required': True}
        }

    def validate_name(self, value):
        """Case-insensitive unique name validation"""
        if not value or not value.strip():
            raise serializers.ValidationError("Department name cannot be empty.")
            
        qs = Department.objects.filter(name__iexact=value.strip())
        if self.instance:  # If updating existing instance
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Department with this name already exists.")
        return value.strip()

    def create(self, validated_data):
        """Custom create to handle potential null head_of_department"""
        try:
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError(str(e))

    def update(self, instance, validated_data):
        """Custom update to handle partial updates"""
        try:
            return super().update(instance, validated_data)
        except Exception as e:
            raise serializers.ValidationError(str(e))