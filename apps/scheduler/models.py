from datetime import datetime

from django.db import models
from django.db.models import Q
from multiselectfield import MultiSelectField
from simple_history.models import HistoricalRecords

from .utils import HistorySurveillance

MONTHS = (
    (1, 'January'),
    (2, 'February'),
    (3, 'March'),
    (4, 'April'),
    (5, 'May'),
    (6, 'June'),
    (7, 'July'),
    (8, 'August'),
    (9, 'September'),
    (10, 'October'),
    (11, 'November'),
    (12, 'December'),
)


class Event(HistorySurveillance):
    name = models.CharField(max_length=80)
    order = models.IntegerField(default=1)
    enable = models.BooleanField(default=True)
    months = MultiSelectField(choices=MONTHS, min_choices=1, default=1)
    no_items = models.IntegerField(default=1, help_text='No of submission per application')
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']


class Scheduler(HistorySurveillance):
    name = models.CharField(max_length=80)
    enable = models.BooleanField(default=True)
    events = models.ManyToManyField(Event)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name

    def get_ongoing_event(self):
        today = datetime.today()
        month = today.month.__str__()
        _id = None
        _no_items = None

        raw_queryset = self.events.filter(
            Q(months=month) | Q(months__startswith='%s,' % month) |
            Q(months__endswith=',%s' % month) | Q(months__contains=',%s,' % month)).first()

        if hasattr(raw_queryset, 'id'):
            _id = raw_queryset.id

        if hasattr(raw_queryset, 'no_items'):
            _no_items = raw_queryset.no_items

        return {
            'month': month,
            'event': _id,
            'no_items': _no_items
        }
