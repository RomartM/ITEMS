from django.db import models
from django.utils import timezone

from core.preventive.utils import HistorySurveillance
from core.user.models import User


class Preventive(HistorySurveillance):
    technician = models.ForeignKey(User, on_delete=models.CASCADE)
    schedule = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True


