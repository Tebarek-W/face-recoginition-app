from rest_framework import permissions

class IsInstructor(permissions.BasePermission):
    """
    Only allow instructors to access attendance records.
    """
    def has_permission(self, request, view):
        return request.user.role == 'Instructor'