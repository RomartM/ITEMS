from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import ugettext_lazy as _
from simple_history.models import HistoricalRecords

from .utils import IndexedTimeStampedModel, HistorySurveillance
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, IndexedTimeStampedModel):
    first_name = models.CharField(max_length=80, default='')
    last_name = models.CharField(max_length=80, default='')
    designation = models.CharField(max_length=100, default='N/A', blank=True)
    contact_number = models.CharField(max_length=30, default='')
    email = models.EmailField(max_length=255, unique=True)
    role = models.CharField(max_length=30, choices=(
        ('clientele', 'Clientele'),
        ('technician', 'Technician'),
        ('attendant', 'Attendant'),
    ), default='technician')
    is_staff = models.BooleanField(
        default=False, help_text=_("Designates whether the user can log into this admin " "site.")
    )
    is_active = models.BooleanField(
        default=True,
        help_text=_(
            "Designates whether this user should be treated as "
            "active. Unselect this instead of deleting accounts."
        ),
    )
    history_instance = models.IntegerField(null=True, blank=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    objects = UserManager()

    USERNAME_FIELD = "email"

    def get_full_name(self):
        return "%s %s" % (self.first_name.title(), self.last_name.title())

    def get_short_name(self):
        return self.first_name.title()

    def get_initial_name(self):
        return "%s%s".capitalize() % (self.first_name[:1], self.last_name[:1])

    def has_role(self, pk):
        return bool(self.groups.filter(pk=pk))

    def __str__(self):
        return self.email


class Office(HistorySurveillance):
    name = models.CharField(max_length=100, unique=True)
    enable = models.BooleanField(default=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name
