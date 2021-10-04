from django.urls import path
from rest_framework.routers import DefaultRouter

from modules.device.computer.api.views import ComputerViewSet, ComputerRemarkViewSet, ComputerCheckListViewSet, overview

app_name = 'api'
urlpatterns = [
    path('overview/', overview, name='overview'),
]

router = DefaultRouter()
router.register('remark', ComputerRemarkViewSet, basename='remark')
router.register('checklist', ComputerCheckListViewSet, basename='checklist')
router.register('', ComputerViewSet, basename='computer')
urlpatterns += router.urls