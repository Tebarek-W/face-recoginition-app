from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from .models import AttendanceRule
from .serializers import AttendanceRuleSerializer

@api_view(['GET'])
def analytics_root(request, format=None):
    """API root view that lists available endpoints"""
    return Response({
        'attendance-analytics': reverse('attendance-analytics', request=request, format=format),
        'attendance-rules': reverse('attendance-rules', request=request, format=format),
    })

class AttendanceAnalyticsView(APIView):
    """View for handling attendance analytics data"""
    
    def get(self, request):
        """Get attendance analytics summary"""
        # Implement your analytics logic here
        data = {
            "total_students": 0,
            "present_count": 0,
            "absent_count": 0,
        }
        return Response(data)

class AttendanceRulesView(APIView):
    """View for managing attendance rules"""
    
    def get(self, request):
        """Get current attendance rules"""
        rules, created = AttendanceRule.objects.get_or_create(
            defaults={
                'minimum_attendance': 75,
                'late_policy': 3,
                'notification_threshold': 70,
                'grace_period': 15
            }
        )
        serializer = AttendanceRuleSerializer(rules)
        return Response(serializer.data)
    
    def put(self, request):
        """Update attendance rules"""
        rules, created = AttendanceRule.objects.get_or_create(
            defaults={
                'minimum_attendance': 75,
                'late_policy': 3,
                'notification_threshold': 70,
                'grace_period': 15
            }
        )
        
        serializer = AttendanceRuleSerializer(rules, data=request.data, partial=True)
        if serializer.is_valid():
            # Only set updated_by if user is authenticated
            if request.user.is_authenticated:
                serializer.save(updated_by=request.user)
            else:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        """Create or update attendance rules (same as PUT)"""
        return self.put(request)