# serializers.py
from rest_framework import serializers
from .models import Schedule
from courses.serializers import CourseSerializer
from instructors.serializers import InstructorSerializer

class ScheduleSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    instructor = InstructorSerializer(read_only=True)
    
    class Meta:
        model = Schedule
        fields = '__all__'

class CreateScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['course', 'instructor', 'day', 'start_time', 'end_time', 'room']