import logging
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from courses.models import Course
from instructors.models import Instructor

logger = logging.getLogger(__name__)

class Schedule(models.Model):
    DAY_CHOICES = [
        ('Monday', _('Monday')),
        ('Tuesday', _('Tuesday')),
        ('Wednesday', _('Wednesday')),
        ('Thursday', _('Thursday')),
        ('Friday', _('Friday')),
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
        default='TBA'
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
        course_name = getattr(self.course, 'name', 'Unknown Course')
        return f"{course_name} - {self.day} {self.start_time}-{self.end_time} ({self.room})"

    def clean(self):
        """Validate time logic and prevent conflicts"""
        errors = {}
        
        # Validate time order
        if self.start_time >= self.end_time:
            errors['end_time'] = _('End time must be after start time')
        
        # Check for room conflicts (only for existing instances)
        conflicting_schedules = Schedule.objects.filter(
            day=self.day,
            room=self.room,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(pk=getattr(self, 'pk', None))
        
        if conflicting_schedules.exists():
            errors['room'] = _('This room is already booked during this time slot')
        
        # Check for instructor conflicts
        instructor_conflicts = Schedule.objects.filter(
            day=self.day,
            instructor=self.instructor,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        ).exclude(pk=getattr(self, 'pk', None))
        
        if instructor_conflicts.exists():
            errors['instructor'] = _('This instructor already has a class during this time')
        
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        """Ensure validation runs on save and send notifications"""
        is_new = self._state.adding
        
        try:
            self.full_clean()
            super().save(*args, **kwargs)
            
            # Only send notification after successful save
            action = "created" if is_new else "updated"
            self._send_schedule_notification(action)
            
        except Exception as e:
            logger.error(f"Error saving schedule: {str(e)}")
            raise

    def delete(self, *args, **kwargs):
        """Send notification before deletion"""
        try:
            self._send_schedule_notification("deleted")
        except Exception as e:
            logger.error(f"Error sending delete notification: {str(e)}")
        
        super().delete(*args, **kwargs)

    def _send_schedule_notification(self, action):
        """Helper method to send schedule notifications"""
        try:
            course_name = getattr(self.course, 'name', 'Unknown Course')
            instructor = getattr(self, 'instructor', None)
            instructor_name = getattr(
                getattr(instructor, 'user', None),
                'get_full_name',
                lambda: 'Unknown Instructor'
            )()
            
            message = {
                'type': 'schedule_change',
                'action': action,
                'schedule_id': self.id,
                'course': course_name,
                'instructor': instructor_name,
                'day': self.day,
                'time': f"{self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')}",
                'room': self.room,
                'timestamp': timezone.now().isoformat(),
                'message': f"Schedule {action}: {course_name} on {self.day} at {self.room}"
            }
            
            self._send_ws_notification(message)
            
        except Exception as e:
            logger.error(f"Error preparing notification: {str(e)}")

    def _send_ws_notification(self, message):
        """Send WebSocket notification"""
        try:
            channel_layer = get_channel_layer()
            if channel_layer is None:
                logger.error("Channel layer is not configured")
                return

            async_to_sync(channel_layer.group_send)(
                "notifications",
                {
                    'type': 'send_notification',
                    'content': message
                }
            )
            logger.info(f"Notification sent: {message}")
            
        except Exception as e:
            logger.error(f"WebSocket notification failed: {str(e)}")


# Signal handlers for alternative notification approach
@receiver(post_save, sender=Schedule)
def schedule_post_save(sender, instance, created, **kwargs):
    """Signal-based notification for schedule changes"""
    if kwargs.get('raw', False):  # Skip for fixture loading
        return
    action = "created" if created else "updated"
    instance._send_schedule_notification(action)

@receiver(post_delete, sender=Schedule)
def schedule_post_delete(sender, instance, **kwargs):
    """Signal-based notification for schedule deletion"""
    instance._send_schedule_notification("deleted")
