from django.urls import path, include

from core.common import views

app_name = 'common'
urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    # API
    path('api/', include('core.common.api.urls')),
]