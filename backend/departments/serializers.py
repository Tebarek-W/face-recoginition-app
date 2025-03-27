from rest_framework import serializers
from .models import Department
from django.contrib.auth import get_user_model
from users.serializers import UserBasicSerializer

User = get_user_model()

class DepartmentBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code']
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
            'code',
            'head_of_department',
            'head_of_department_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'head_of_department']

    def validate_name(self, value):
        qs = Department.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Department with this name already exists.")
        return value