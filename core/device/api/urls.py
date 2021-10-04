from django.urls import path
from rest_framework.routers import DefaultRouter

from core.device.api.views import BrandViewSet, DeviceViewSet, BrandSelectViewSet, available_devices

app_name = 'api_device'
urlpatterns = [
    path('', available_devices, name='available'),
]

router = DefaultRouter()
router.register('brand', BrandViewSet, basename='brand')
router.register('brand-select', BrandSelectViewSet, basename='brand_select')
router.register('', DeviceViewSet, basename='device')
urlpatterns += router.urls