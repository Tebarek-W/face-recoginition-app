from rest_framework import serializers
from .models import Student
from users.serializers import UserBasicSerializer
from departments.serializers import DepartmentSerializer
from departments.models import Department
from datetime import datetime
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class StudentSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'


class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    # Department is now optional
    department = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        required=False,
        allow_null=True
    )
    
    # Date of birth with multiple formats for flexibility
    date_of_birth = serializers.DateField(
        input_formats=['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y', 'iso-8601'],
        required=True
    )

    # Year of study must be between 1 and 8
    year_of_study = serializers.IntegerField(
        required=True,
        min_value=1,
        max_value=8
    )

    # Including all the required fields in the serializer
    class Meta:
        model = Student
        fields = (
            'first_name', 
            'last_name', 
            'gender', 
            'date_of_birth', 
            'email', 
            'password',
            'department',
            'year_of_study'
        )

    def validate_email(self, value):
        # Validate if email already exists in the database
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("A student with this email already exists.")
        return value
    
    def validate_date_of_birth(self, value):
        # Ensure date of birth is not in the future
        if value > datetime.now().date():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value
    
    def validate_year_of_study(self, value):
        # Ensure the year of study is between 1 and 8
        if value < 1 or value > 8:
            raise serializers.ValidationError("Year of study must be between 1 and 8.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')

        # Generate a unique username from the first name
        first_name = validated_data.get('first_name', '').lower()
        base_username = f"@{first_name}" if first_name else "@user"
        username = base_username
        counter = 1

        # Ensure the generated username is unique
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user_data = {
            'email': validated_data['email'],
            'username': username,
            'password': password,
            'role': 'STUDENT',  # Assuming role is assigned to each student
        }

        # Using create_user to ensure the password is hashed securely
        user = User.objects.create_user(**user_data)

        # Create the student object
        student = Student.objects.create(
            user=user,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            gender=validated_data.get('gender', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            email=validated_data.get('email'),
            department=validated_data.get('department', None),
            year_of_study=validated_data.get('year_of_study', 1),
        )

        return student
