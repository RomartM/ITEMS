from django.urls import path, include

from core.device import views

app_name = 'device'
urlpatterns = [
    path('', views.devices, name='list'),

    # path('computer/', include('modules.computer.urls')),
]