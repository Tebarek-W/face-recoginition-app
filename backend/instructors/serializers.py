from rest_framework import serializers
from .models import Instructor
from users.models import User
from users.serializers import UserBasicSerializer
from departments.serializers import DepartmentBasicSerializer
from departments.models import Department
from courses.models import Course
from django.utils.text import slugify
from django.db import IntegrityError

class InstructorCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(write_only=True, required=True)
    gender = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    avatar = serializers.ImageField(write_only=True, required=False)
    courses = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        default=[]
    )
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Instructor
        fields = [
            'first_name', 'last_name', 'email', 'gender', 'password',
            'avatar', 'department_id', 'courses'
        ]

    def validate(self, data):
        required_fields = ['first_name', 'last_name', 'email', 'gender', 'password']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "This field is required."})
        return data

    def create(self, validated_data):
        first_name = validated_data['first_name'].lower().replace(' ', '')
        base_username = f"@{first_name}"
        username = base_username
        counter = 1
        
        while True:
            try:
                user = User.objects.create_user(
                    username=username,
                    email=validated_data['email'],
                    password=validated_data['password'],
                    first_name=validated_data['first_name'],
                    last_name=validated_data['last_name'],
                    gender=validated_data['gender'],
                    role='INSTRUCTOR'
                )
                break
            except IntegrityError as e:
                if 'username' in str(e):
                    username = f"{base_username}{counter}"
                    counter += 1
                else:
                    raise serializers.ValidationError(str(e))

        if 'avatar' in validated_data:
            user.avatar = validated_data['avatar']
            user.save()

        instructor = Instructor.objects.create(
            user=user,
            department=validated_data.get('department')
        )

        if 'courses' in validated_data:
            instructor.courses.set(validated_data['courses'])

        return instructor

class InstructorUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    gender = serializers.CharField(source='user.gender', required=False)
    password = serializers.CharField(source='user.password', write_only=True, required=False)
    avatar = serializers.ImageField(source='user.avatar', required=False, allow_null=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        required=False,
        allow_null=True
    )
    courses = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Course.objects.all(),
        required=False
    )

    class Meta:
        model = Instructor
        fields = [
            'first_name', 'last_name', 'email', 'gender', 'password',
            'avatar', 'department_id', 'courses'
        ]

    def to_internal_value(self, data):
        # Handle both FormData and JSON input
        if hasattr(data, 'getlist'):
            processed_data = {}
            for key in data:
                if key == 'courses':
                    # Handle both single and multiple course IDs
                    courses = data.getlist(key)
                    processed_data[key] = [int(course_id) for course_id in courses] if courses else []
                elif key in ['department_id'] and data.get(key):
                    processed_data[key] = int(data.get(key))
                else:
                    processed_data[key] = data.get(key)
            return super().to_internal_value(processed_data)
        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update user fields
        for attr, value in user_data.items():
            if attr == 'password':
                user.set_password(value)
            else:
                setattr(user, attr, value)
        user.save()

        # Update instructor fields
        department = validated_data.pop('department', None)
        if department is not None:
            instance.department = department

        # Handle courses update - only if 'courses' key exists in validated_data
        if 'courses' in validated_data:
            instance.courses.set(validated_data['courses'])

        instance.save()
        return instance
    


class InstructorBasicSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    gender = serializers.CharField(source='user.gender', read_only=True)
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    department = DepartmentBasicSerializer(read_only=True)

    class Meta:
        model = Instructor
        fields = ['id', 'email', 'first_name', 'last_name', 'gender', 'avatar', 'department']

class InstructorReadSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    department = DepartmentBasicSerializer(read_only=True)
    courses = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Instructor
        fields = ['id', 'user', 'department', 'courses', 'created_at', 'updated_at']