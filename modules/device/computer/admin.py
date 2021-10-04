from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from solo.admin import SingletonModelAdmin

from apps.checklist.models import Group
from modules.device.computer.forms import ComputerCheckListForm
from modules.device.computer.models import ComputerDevice, ComputerCheckList, ComputerSetting, ComputerRemark


class ComputerDeviceAdmin(SimpleHistoryAdmin):
    list_display = ("brand", "model", "office", "equipment_type", "serial", "mac_address")
    list_filter = ("equipment_type", "office", "brand",)
    search_fields = ("serial", "mac_address",)
    readonly_fields = ["device_id", "date_added"]


class ComputerCheckListAdmin(SimpleHistoryAdmin):
    list_select_related = ("device",)
    list_display = ("schedule", "device", "office", "user", "mac_address",)
    list_filter = ("device__brand", "device__office", "device__equipment_type")
    search_fields = ("device__office__name", "device__serial", "device__user__name", "device__mac_address",)

    # form = ComputerCheckListForm

    def __init__(self, model, admin_site):
        self.form.admin_site = admin_site
        super(ComputerCheckListAdmin, self).__init__(model, admin_site)

    @staticmethod
    def office(obj):
        return "%s" % obj.device.office

    @staticmethod
    def user(obj):
        return "%s" % obj.device.user

    @staticmethod
    def mac_address(obj):
        return "%s" % obj.device.mac_address

    def get_form(self, request, obj=None, **kwargs):
        kwargs['fields'] = ['schedule', 'technician', 'device', 'conforme', 'evaluator', 'attested', 'data', ]

        return super().get_form(request, obj, **kwargs)


ComputerSetting.get_solo()
admin.site.register(ComputerSetting, SingletonModelAdmin)
admin.site.register(ComputerRemark)
admin.site.register(ComputerDevice, ComputerDeviceAdmin)
admin.site.register(ComputerCheckList, ComputerCheckListAdmin)
