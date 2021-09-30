from django.contrib import admin
from django.db.models import Q
from django.urls import reverse
from django.utils.html import format_html
from simple_history.admin import SimpleHistoryAdmin

from apps.checklist.models import CheckList, Group, Item, Remark


class CheckListAdmin(SimpleHistoryAdmin):
    list_display = ("name", "enable")

    def get_object(self, request, object_id, from_field=None):
        obj = super().get_object(request, object_id, from_field=from_field)
        request.checklist_obj = obj
        return obj

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "task":
            if hasattr(request, 'checklist_obj'):
                cd = Group.objects.filter(
                    Q(item__isnull=True) | Q(checklist=request.checklist_obj))
            else:
                cd = Group.objects.filter(item__isnull=True)
            kwargs["queryset"] = cd
        return super().formfield_for_manytomany(db_field, request, **kwargs)


class GroupAdmin(SimpleHistoryAdmin):
    list_display = ("name", "enable", "tagged_names")
    list_filter = ("enable",)
    search_fields = ("name",)

    @staticmethod
    def tagged_names(obj):
        url = (
                reverse("admin:checklist_item_changelist") +
                "?group__id__exact=%s" % obj.id
        )
        return format_html('<a href="{}">{} Items</a>', url, obj.item.count())

    def get_object(self, request, object_id, from_field=None):
        obj = super().get_object(request, object_id, from_field=from_field)
        request.task_obj = obj
        return obj

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "item":
            if hasattr(request, 'task_obj'):
                cd = Item.objects.filter(Q(group__isnull=True) | Q(group=request.task_obj))
            else:
                cd = Item.objects.filter(group__isnull=True)
            kwargs["queryset"] = cd
        return super().formfield_for_manytomany(db_field, request, **kwargs)


class ItemAdmin(SimpleHistoryAdmin):
    list_display = ("name", "enable", "label", "config_group",)
    list_filter = ("group", "enable", "label",)
    search_fields = ("name",)

    @staticmethod
    def config_group(obj):
        task_instance = obj.group_set.all().first()
        if task_instance:
            url = (
                reverse("admin:checklist_group_change", kwargs={'object_id': task_instance.id})
            )
            return format_html('<a href="{}">{}</a>', url, task_instance.name)
        return 'No link to any group'


class RemarkAdmin(SimpleHistoryAdmin):
    search_fields = ("name",)


admin.site.register(CheckList, CheckListAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(Remark, RemarkAdmin)