from rest_framework.routers import DefaultRouter

from core.user.api.views import UserViewSet, LogEntryViewSet, OfficeViewSet, \
    OfficeSelectViewSet, ClienteleSelectViewSet

app_name = 'api'
urlpatterns = []

router = DefaultRouter()
router.register('activity', LogEntryViewSet, basename='activity')
router.register('office', OfficeViewSet, basename='office')
router.register('office-select', OfficeSelectViewSet, basename='office_select')
router.register('select', ClienteleSelectViewSet, basename='user_select')
router.register('', UserViewSet, basename='user')
urlpatterns += router.urls
