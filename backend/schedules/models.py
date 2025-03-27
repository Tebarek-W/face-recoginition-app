from django.db import models
from django.core.exceptions import ValidationError
from courses.models import Course
from instructors.models import Instructor
from django.utils.translation import gettext_lazy as _

class Schedule(models.Model):
    DAY_CHOICES = [
        ('Monday', _('Monday')),
        ('Tuesday', _('Tuesday')),
        ('Wednesday', _('Wednesday')),
        ('Thursday', _('Thursday')),
        ('Friday', _('Friday')),
        ('Saturday', _('Saturday')),
        ('Sunday', _('Sunday')),
    ]
    
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='schedules',
        verbose_name=_('Course')
    )
    instructor = models.ForeignKey(
        Instructor,
        on_delete=models.CASCADE,
        related_name='schedules',
        verbose_name=_('Instructor')
    )
    day = models.CharField(
        max_length=10,
        choices=DAY_CHOICES,
        default='Monday',
        verbose_name=_('Day of Week')
    )
    start_time = models.TimeField(verbose_name=_('Start Time'))
    end_time = models.TimeField(verbose_name=_('End Time'))
    room = models.CharField(
        max_length=50,
        verbose_name=_('Room'),
        help_text=_("Room number or name (e.g., 'A-101')"),
        default='TBA'  # Temporary default for existing records
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))

    class Meta:
        ordering = ['day', 'start_time']
        verbose_name = _('Schedule')
        verbose_name_plural = _('Schedules')
        unique_together = [
            ('room', 'day', 'start_time', 'end_time'),
            ('instructor', 'day', 'start_time', 'end_time')
        ]

    def __str__(self):
        return f"{self.course.name} - {self.day} {self.start_time}-{self.end_time} ({self.room})"

    def clean(self):
        """Validate time logic and prevent conflicts"""
        errors = {}
        
        # Validate time order
        if self.start_time >= self.end_time:
            errors['end_time'] = _('End time must be after start time')
        
        # Check for room conflicts
        conflicting_schedules = Schedule.objects.filter(
            day=self.day,
            room=self.room,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(pk=self.pk)
        
        if conflicting_schedules.exists():
            errors['room'] = _('This room is already booked during this time slot')
        
        # Check for instructor conflicts
        instructor_conflicts = Schedule.objects.filter(
            day=self.day,
            instructor=self.instructor,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(pk=self.pk)
        
        if instructor_conflicts.exists():
            errors['instructor'] = _('This instructor already has a class during this time')
        
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Ensure validation runs on save"""
        self.full_clean()
        super().save(*args, **kwargs)