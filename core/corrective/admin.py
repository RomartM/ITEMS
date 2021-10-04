from django.contrib import admin

from core.corrective.models import RequestType, ServiceRequest


class AdminRequestType(admin.ModelAdmin):
    pass


class AdminServiceRequest(admin.ModelAdmin):
    pass


admin.site.register(RequestType, AdminRequestType)
admin.site.register(ServiceRequest, AdminServiceRequest)
