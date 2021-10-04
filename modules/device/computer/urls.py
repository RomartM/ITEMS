from django.urls import path, include

from modules.device.computer import views

app_name = 'computer'
urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('new', views.new, name='new'),
    path('edit/<int:pk>', views.edit, name='edit'),
    path('details/<int:pk>', views.details, name='details'),

    # API
    path('api/', include('modules.device.computer.api.urls')),
    # path('new-device', views.new_device, name='new_device'),
    # path('manage/<int:pk>', views.manage, name='manage'),
]
