from django.urls import path, include

app_name = 'scheduler'
urlpatterns = [
    # API
    path('api/', include('apps.scheduler.api.urls')),
]