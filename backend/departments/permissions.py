from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users to access department endpoints.
    """
    message = "Only admin users can perform this action."

    def has_permission(self, request, view):
        # Check if user is authenticated and has ADMIN role
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'ADMIN'
        )

    def has_object_permission(self, request, view, obj):
        # For object-level permissions, same as global for departments
        return self.has_permission(request, view)