from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from core.device.models import Brand, Device


class BrandAdmin(SimpleHistoryAdmin):
    pass


class DeviceAdmin(SimpleHistoryAdmin):
    readonly_fields = ["device_id", "date_added"]


admin.site.register(Brand, BrandAdmin)
admin.site.register(Device, DeviceAdmin)
