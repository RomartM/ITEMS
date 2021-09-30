from rest_framework.routers import DefaultRouter

from apps.scheduler.api.views import EventViewSet, SchedulerViewSet

app_name = 'api_scheduler'
urlpatterns = []

router = DefaultRouter()
router.register('event', EventViewSet, basename='event')
router.register('', SchedulerViewSet, basename='scheduler')
urlpatterns += router.urls