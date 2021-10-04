from django.urls import path, include

app_name = 'checklist'
urlpatterns = [
    # API
    path('api/', include('apps.checklist.api.urls')),
]