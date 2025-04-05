from django.db import models
from django.utils import timezone
from users.models import User

class AttendanceRule(models.Model):
    """
    Stores system-wide attendance rules and policies
    """
    minimum_attendance = models.PositiveIntegerField(
        default=75,
        help_text="Minimum attendance percentage required"
    )
    late_policy = models.PositiveIntegerField(
        default=3,
        help_text="Number of late arrivals = 1 absence"
    )
    notification_threshold = models.PositiveIntegerField(
        default=70,
        help_text="Warning threshold percentage"
    )
    grace_period = models.PositiveIntegerField(
        default=15,
        help_text="Grace period in minutes"
    )
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Attendance Rule"
        verbose_name_plural = "Attendance Rules"

    def __str__(self):
        return f"Rules (Min: {self.minimum_attendance}%)"

    @classmethod
    def get_active_rules(cls):
        """Gets or creates default rules"""
        return cls.objects.get_or_create(
            defaults={
                'minimum_attendance': 75,
                'late_policy': 3,
                'notification_threshold': 70,
                'grace_period': 15
            }
        )[0]