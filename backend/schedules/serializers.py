from rest_framework import serializers
from .models import Schedule
from courses.models import Course
from instructors.models import Instructor
from datetime import datetime

class ScheduleSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())
    instructor = serializers.PrimaryKeyRelatedField(queryset=Instructor.objects.all())
    
    class Meta:
        model = Schedule
        fields = '__all__'
        depth = 1

    def to_internal_value(self, data):
        # Handle time format conversion more flexibly
        data = data.copy()
        
        for time_field in ['start_time', 'end_time']:
            if time_field in data and isinstance(data[time_field], str):
                try:
                    time_parts = data[time_field].split(':')
                    if len(time_parts) == 2:  # HH:MM
                        data[time_field] = f"{data[time_field]}:00"
                    elif len(time_parts) == 3:  # HH:MM:SS
                        pass  # Already correct format
                except:
                    pass  # Let the validation handle it
                    
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
        # Convert day to capitalized format
        if 'day' in data:
            data['day'] = data['day'].capitalize()
            
        # More flexible time validation
        if 'start_time' in data and 'end_time' in data:
            if isinstance(data['start_time'], str):
                try:
                    data['start_time'] = datetime.strptime(data['start_time'], '%H:%M:%S').time()
                except ValueError:
                    try:
                        data['start_time'] = datetime.strptime(data['start_time'], '%H:%M').time()
                    except ValueError:
                        raise serializers.ValidationError({'start_time': 'Invalid time format'})
            
            if isinstance(data['end_time'], str):
                try:
                    data['end_time'] = datetime.strptime(data['end_time'], '%H:%M:%S').time()
                except ValueError:
                    try:
                        data['end_time'] = datetime.strptime(data['end_time'], '%H:%M').time()
                    except ValueError:
                        raise serializers.ValidationError({'end_time': 'Invalid time format'})
            
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError({'end_time': 'Must be after start time'})
        
        return data