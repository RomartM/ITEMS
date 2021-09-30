from rest_framework.permissions import BasePermission


class CanUpdateDelete(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        if view.action in ['update', 'partial_update', 'destroy']:

            if user:
                return user.is_superuser
            else:
                return False

        else:
            return view.action in ['list', 'create', 'retrieve']
