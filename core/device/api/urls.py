from rest_framework.routers import DefaultRouter

from core.device.api.views import BrandViewSet, DeviceViewSet, BrandSelectViewSet

app_name = 'api_device'
urlpatterns = []

router = DefaultRouter()
router.register('brand', BrandViewSet, basename='brand')
router.register('brand-select', BrandSelectViewSet, basename='brand_select')
router.register('', DeviceViewSet, basename='device')
urlpatterns += router.urls