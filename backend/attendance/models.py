from django.db import models
from students.models import Student  # Assuming Student model is in students app
from schedules.models import Schedule  # Assuming Schedule model is in schedules app

class AttendanceRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='attendance_records')
    attendance_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('Present', 'Present'), ('Absent', 'Absent')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Attendance for {self.student.user.username} on {self.schedule.date}"