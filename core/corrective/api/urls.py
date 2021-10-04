from rest_framework.routers import DefaultRouter

from core.corrective.api.views import RequestTypeViewSet, ServiceRequestViewSet

app_name = 'api_corrective'
urlpatterns = []

router = DefaultRouter()
router.register('request_type', RequestTypeViewSet, basename='request_type')
router.register('service_request', ServiceRequestViewSet, basename='service_request')
# router.register('', UserViewSet, basename='user')
urlpatterns += router.urls