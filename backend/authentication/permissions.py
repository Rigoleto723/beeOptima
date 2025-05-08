from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Permite el acceso solo a usuarios del grupo Administrador."""
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="Administrador").exists()

class IsUser(BasePermission):
    """Permite el acceso solo a usuarios del grupo Usuario."""
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="Usuario").exists()
