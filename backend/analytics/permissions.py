from rest_framework import permissions

class IsHoDOrInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow only HoD or Instructor
        return request.user.role in ['HEAD', 'INSTRUCTOR']