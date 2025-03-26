from rest_framework import permissions

class IsHeadOfDepartment(permissions.BasePermission):
    def has_permission(self, request, view):
        # Only allow HoD to access student records
        return request.user.role == 'HoD'