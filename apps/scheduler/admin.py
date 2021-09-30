from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from apps.scheduler.models import Scheduler, Event


class EventAdmin(SimpleHistoryAdmin):
    pass


class SchedulerAdmin(SimpleHistoryAdmin):
    pass


admin.site.register(Event, SchedulerAdmin)
admin.site.register(Scheduler, SchedulerAdmin)
