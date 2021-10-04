from datetime import datetime

from django.db import models
from django.db.models import JSONField, Q
from simple_history.models import HistoricalRecords
from solo.models import SingletonModel

from apps.checklist.models import CheckList
from apps.scheduler.models import Scheduler, Event
from core.device.models import Device
from core.preventive.models import Preventive
from core.user.models import Clientele
from modules.device.computer.constants import COMPUTER_EQUIPMENT_TYPE
from .utils import HistorySurveillance


class ComputerSetting(SingletonModel):
    enable = models.BooleanField(default=True, help_text='Enable Module')
    check_list = models.ForeignKey(CheckList, on_delete=models.CASCADE, blank=True, null=True)
    scheduler = models.ForeignKey(Scheduler, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return "Settings"

    class Meta:
        verbose_name = "Settings"


class ComputerDevice(Device):
    equipment_type = models.CharField(choices=COMPUTER_EQUIPMENT_TYPE, max_length=30)
    equipment_type_other = models.CharField(max_length=80, blank=True)
    serial = models.CharField(max_length=150)
    mac_address = models.CharField(max_length=32, unique=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    class Meta:
        verbose_name = "Device"

    def get_pm_count(self):
        return self.computerchecklist_set.count()

    def get_sr_count(self):
        return 0

    def get_so_count(self):
        return 0

    def get_current_submitted(self):
        today = datetime.today()
        month = today.month.__str__()

        return self.computerchecklist_set.filter(
            Q(scheduler__events__months=month) | Q(scheduler__events__months__startswith='%s,' % month) | Q(
                scheduler__events__months__endswith=',%s' % month) | Q(
                scheduler__events__months__contains=',%s,' % month))

    def get_last_submitted_event_id(self):
        today = datetime.today()
        year = today.year.__str__()
        _id = None

        raw_queryset = self.computerchecklist_set.filter(schedule__year=year).order_by('-schedule').first()

        if hasattr(raw_queryset, 'event_id'):
            _id = raw_queryset.event_id

        return _id


class ComputerCheckList(Preventive):
    device = models.ForeignKey(ComputerDevice, on_delete=models.CASCADE)
    scheduler = models.ForeignKey(Scheduler, on_delete=models.CASCADE,
                                  default=ComputerSetting.get_solo().scheduler.id)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    checklist = models.ForeignKey(CheckList, on_delete=models.CASCADE,
                                  default=ComputerSetting.get_solo().check_list.id)
    data = JSONField()
    conforme = models.CharField(max_length=80, blank=True)
    evaluator = models.CharField(max_length=80, blank=True)
    attested = models.CharField(max_length=80, blank=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    class Meta:
        verbose_name = "Checklist"

    def __str__(self):
        return "%s - %s" % (self.device, self.event.name)

    def get_status(self):
        if self.conforme and self.evaluator and self.attested:
            return 'Verified'
        elif self.conforme or self.evaluator or self.attested:
            return 'Partially Verified'
        else:
            return 'Not Verified'


class ComputerServiceOrder(models.Model):
    issued_to = models.ForeignKey(Clientele, on_delete=models.CASCADE)


class ComputerRemark(HistorySurveillance):
    name = models.CharField(max_length=100, unique=True)
    enable = models.BooleanField(default=True)
    history = HistoricalRecords(excluded_fields=['history_instance'])

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Remark"
