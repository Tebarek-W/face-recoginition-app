from rest_framework import serializers
from .models import Student
from users.serializers import UserBasicSerializer  # Assuming you have a UserSerializer
from departments.serializers import DepartmentSerializer  # Assuming you have a DepartmentSerializer

class StudentSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)  # Nested serializer for user details
    department = DepartmentSerializer(read_only=True)  # Nested serializer for department details

    class Meta:
        model = Student
        fields = ['id', 'user', 'department', 'facial_data', 'roll_number', 'year_of_study', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']