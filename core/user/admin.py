from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from .constants import TECHNICAL
from .models import User


class CustomUserAdmin(UserAdmin):
    list_display = ("id", "first_name", "last_name", "contact_number", "email", "created", "modified")
    list_filter = ("is_active", "is_staff", "groups")
    search_fields = ("email", "first_name", "last_name", "contact_number",)
    ordering = ("email", "first_name", "last_name",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )

    fieldsets = (
        (
            _("Personal Information"),
            {"fields": ("first_name", "last_name", "contact_number")}
        ),
        (
            _("Account Credential"),
            {"fields": ("email", "password")}
        ),
        (
            _("Permissions"),
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
    )
    add_fieldsets = ((None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),)

    def get_search_fields(self, request):
        """
        Return a sequence containing the fields to be searched whenever
        somebody submits a search query.
        """
        if request.user.has_role(pk=TECHNICAL) and not request.user.is_superuser:
            return ()
        return self.search_fields

    def get_list_filter(self, request):
        """
        Return a sequence containing the fields to be displayed as filters in
        the right sidebar of the changelist page.
        """
        if request.user.has_role(pk=TECHNICAL) and not request.user.is_superuser:
            return ()
        return self.list_filter

    def get_fieldsets(self, request, obj=None):
        if request.user.has_role(pk=TECHNICAL) and not request.user.is_superuser:
            return (
                (
                    _("Personal Information"),
                    {"fields": ("first_name", "last_name", "contact_number")}
                ),
                (
                    _("Account Credential"),
                    {"fields": ("email", "password")}
                ),
            )
        return self.fieldsets

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.has_role(pk=TECHNICAL) and not request.user.is_superuser:
            queryset = queryset.filter(pk=request.user.pk)
        if not self.has_view_or_change_permission(request):
            queryset = queryset.none()
        return queryset


admin.site.register(User, CustomUserAdmin)
