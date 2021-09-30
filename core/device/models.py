from django.db import models
from django.utils import timezone
from simple_history.models import HistoricalRecords

from core.user.models import Clientele, Office
from .utils import HistorySurveillance


class Brand(HistorySurveillance):
    name = models.CharField(max_length=100, unique=True)
    enable = models.BooleanField(default=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name


class Device(HistorySurveillance):
    device_id = models.CharField(max_length=8, blank=True)
    clientele = models.ForeignKey(Clientele, on_delete=models.CASCADE)
    office = models.ForeignKey(Office, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    model = models.CharField(max_length=200)
    date_acquired = models.DateField(default=timezone.now)
    date_added = models.DateTimeField(default=timezone.now, blank=True)
    unit_cost = models.CharField(max_length=20)
    history = HistoricalRecords(excluded_fields=['history_instance'])


    def __str__(self):
        return "%s %s" % (self.brand.name, self.model)

    def update_model(self):
        # You now have both access to self.id and self.name

        device = Device.objects.filter(pk=self.pk)

        current_year = str(self.date_added.year)[2:]
        format_id = f'{current_year:0>2}{self.pk:0>5}'

        device.update(device_id=format_id)

        # Do some stuff, update your model...

    def save(self, *args, **kwargs):
        super(Device, self).save(*args, **kwargs)
        self.update_model()  # Call the function
