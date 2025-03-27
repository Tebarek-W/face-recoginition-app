from rest_framework import serializers
from .models import Course
from instructors.serializers import InstructorBasicSerializer
from departments.serializers import DepartmentBasicSerializer

class CourseReadSerializer(serializers.ModelSerializer):
    instructor_details = InstructorBasicSerializer(
        source='instructor', 
        read_only=True
    )
    department_details = DepartmentBasicSerializer(
        source='department',
        read_only=True
    )
    
    class Meta:
        model = Course
        fields = [
            'id',
            'code',
            'name',
            'description',
            'credit_hours',
            'is_active',
            'department',
            'department_details',
            'instructor',
            'instructor_details',
            'created_at',
            'updated_at'
        ]
        extra_kwargs = {
            'department': {'write_only': True},
            'instructor': {'write_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True}
        }

class CourseWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'code',
            'name',
            'description',
            'credit_hours',
            'is_active',
            'department',
            'instructor'
        ]

# Temporary backward compatibility (remove after updating all references)
CourseSerializer = CourseReadSerializer