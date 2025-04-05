from rest_framework import serializers
from .models import Course
from departments.models import Department

class CourseWriteSerializer(serializers.ModelSerializer):
    department_id = serializers.IntegerField(
        required=False,
        allow_null=True,
        write_only=True
    )

    class Meta:
        model = Course
        fields = ['code', 'name', 'credit_hours', 'department_id']
        extra_kwargs = {
            'code': {'required': True, 'allow_blank': False},
            'name': {'required': True, 'allow_blank': False},
            'credit_hours': {
                'required': True,
                'min_value': 1,
                'max_value': 6
            }
        }

    def validate_department_id(self, value):
        if value is None:
            return None
        if not Department.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Department does not exist")
        return value

class CourseReadSerializer(serializers.ModelSerializer):
    department_id = serializers.IntegerField(
        source='department.id', 
        allow_null=True,
        read_only=True
    )
    department_name = serializers.CharField(
        source='department.name',
        allow_null=True,
        read_only=True
    )

    class Meta:
        model = Course
        fields = [
            'id', 'code', 'name', 'credit_hours',
            'department_id', 'department_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = fields