from django.db import models
from courses.models import Course  # Assuming Course model is in courses app
from instructors.models import Instructor  # Assuming Instructor model is in instructors app

class Schedule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='schedules')
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField()  # 1=Monday, 2=Tuesday, ..., 7=Sunday
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField(null=True, blank=True)  # Optional, for specific dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.name} - {self.day_of_week} {self.start_time}-{self.end_time}"