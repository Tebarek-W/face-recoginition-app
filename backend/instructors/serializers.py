from rest_framework import serializers
from .models import Instructor
from users.serializers import UserBasicSerializer
from departments.serializers import DepartmentBasicSerializer

class InstructorBasicSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    department = DepartmentBasicSerializer(read_only=True)

    class Meta:
        model = Instructor
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar', 'department']

class InstructorReadSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    department = DepartmentBasicSerializer(read_only=True)

    class Meta:
        model = Instructor
        fields = ['id', 'user', 'department', 'created_at', 'updated_at']

class InstructorWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = ['user', 'department']

# Temporary backward compatibility aliases
InstructorSerializer = InstructorReadSerializer
InstructorCreateSerializer = InstructorWriteSerializer