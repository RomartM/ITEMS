from django.urls import path, include

from ITEMS.module_url_registration import register_module_url
from core.device import views

app_name = 'device'
urlpatterns = [
    path('', views.devices, name='list'),
    path('api/device/', include('core.device.api.urls')),
]

# Device Module Registration
urlpatterns = register_module_url(app_name, urlpatterns)
