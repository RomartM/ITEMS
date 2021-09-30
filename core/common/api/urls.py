from django.urls import path
from rest_framework.routers import DefaultRouter

from core.common.api.views import overview

app_name = 'api'
urlpatterns = [
    path('', overview, name='overview'),
]

router = DefaultRouter()
urlpatterns += router.urls