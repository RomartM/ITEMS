from django.db import models
from simple_history.models import HistoricalRecords

from .utils import HistorySurveillance


class Remark(models.Model):
    name = models.CharField(max_length=100)
    enable = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Item(HistorySurveillance):
    name = models.CharField(max_length=100)
    enable = models.BooleanField(default=True)
    label = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name


class Group(HistorySurveillance):
    name = models.CharField(max_length=80)
    item = models.ManyToManyField(Item)
    enable = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name


class CheckList(HistorySurveillance):
    name = models.CharField(max_length=80)
    groups = models.ManyToManyField(Group)
    enable = models.BooleanField(default=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name
