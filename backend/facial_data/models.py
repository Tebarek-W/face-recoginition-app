from django.db import models
from students.models import Student
import os

def liveness_video_path(instance, filename):
    return f'liveness_videos/student_{instance.student.pk}/{filename}'

class FacialData(models.Model):
    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        null=True,  # Temporary allowance for null
        blank=True,  # Temporary allowance for blank
        related_name='facial_data'
    )
    video = models.FileField(
        upload_to=liveness_video_path,
        null=True,   # <- Allows existing rows to be saved
        blank=True,  # <- Allows form submission without video
        
    )
    is_verified = models.BooleanField(default=False)
    analysis_results = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"FacialData for {self.student}"

    class Meta:
        verbose_name_plural = "Facial Data"
