from rest_framework import serializers
from .models import Schedule
from courses.models import Course
from instructors.models import Instructor
from departments.models import Department
from datetime import datetime, time

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code']

class InstructorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    email = serializers.CharField(read_only=True)
    department = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = Instructor
        fields = ['id', 'full_name', 'email', 'department']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'credit_hours']

class ScheduleSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    instructor = InstructorSerializer(read_only=True)
    
    # Write-only fields
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=Instructor.objects.all(),
        source='instructor',
        write_only=True
    )

    class Meta:
        model = Schedule
        fields = [
            'id',
            'course', 'course_id',
            'instructor', 'instructor_id',
            'day', 'start_time', 'end_time',
            'room', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'start_time': {'format': '%H:%M:%S'},
            'end_time': {'format': '%H:%M:%S'}
        }

    def to_internal_value(self, data):
        data = data.copy()
        for time_field in ['start_time', 'end_time']:
            if time_field in data:
                if isinstance(data[time_field], str):
                    try:
                        # Ensure time strings have seconds
                        time_parts = data[time_field].split(':')
                        if len(time_parts) == 2:  # HH:MM
                            data[time_field] = f"{data[time_field]}:00"
                    except:
                        pass
                elif isinstance(data[time_field], time):
                    # If it's already a time object, convert to string for DRF
                    data[time_field] = data[time_field].strftime('%H:%M:%S')
        return super().to_internal_value(data)

class CreateScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['course', 'instructor', 'day', 'start_time', 'end_time', 'room']
        extra_kwargs = {
            'start_time': {'required': True},
            'end_time': {'required': True},
        }

    def validate(self, data):
        if 'day' in data:
            data['day'] = data['day'].capitalize()
            
        if 'start_time' in data and 'end_time' in data:
            # Handle both string and time object inputs
            if isinstance(data['start_time'], str):
                try:
                    data['start_time'] = self._parse_time(data['start_time'])
                except ValueError as e:
                    raise serializers.ValidationError({'start_time': str(e)})
            
            if isinstance(data['end_time'], str):
                try:
                    data['end_time'] = self._parse_time(data['end_time'])
                except ValueError as e:
                    raise serializers.ValidationError({'end_time': str(e)})
            
            # If times are already time objects, ensure they're valid
            if isinstance(data['start_time'], time) and isinstance(data['end_time'], time):
                if data['start_time'] >= data['end_time']:
                    raise serializers.ValidationError({'end_time': 'Must be after start time'})
        
        return data

    def _parse_time(self, time_str):
        """Parse time string into time object, handling multiple formats"""
        if isinstance(time_str, time):  # Already a time object
            return time_str
            
        try:
            return datetime.strptime(time_str, '%H:%M:%S').time()
        except ValueError:
            try:
                return datetime.strptime(time_str, '%H:%M').time()
            except ValueError:
                raise ValueError('Invalid time format (use HH:MM or HH:MM:SS)')