from django.db import models
from simple_history.models import HistoricalRecords

from core.user.models import User, Office
from core.device.models import Device
from .utils import HistorySurveillance


class RequestType(HistorySurveillance):
    name = models.CharField(max_length=80)
    description = models.TextField()
    has_status = models.BooleanField(default=False)
    has_other = models.BooleanField(default=False)
    enable = models.BooleanField()
    order = models.IntegerField(default=1)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name


class ServiceRequest(HistorySurveillance):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    office = models.ForeignKey(Office, on_delete=models.CASCADE)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    request_type = models.ForeignKey(RequestType, on_delete=models.CASCADE)
    request_type_status = models.CharField(choices=(
        ('na', 'N/A'),
        ('new', 'New'),
        ('existing', 'Existing'),
        ('relocation', 'Relocation'),), max_length=30, default='na')
    other = models.CharField(max_length=100, help_text='Please specify for other service request', blank=True)
    brief_description = models.TextField(blank=True)
    recommending_approval = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommending_approval', null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='approved_by', null=True, blank=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])
