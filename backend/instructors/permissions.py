from rest_framework import permissions

class IsHeadOfDepartment(permissions.BasePermission):
    """
    Only allow the Head of Department (HoD) to access instructors.
    """
    def has_permission(self, request, view):
        return request.user.role == 'HEAD'