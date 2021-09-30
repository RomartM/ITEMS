from rest_framework.routers import DefaultRouter

from apps.checklist.api.views import CheckListViewSet, GroupViewSet, ItemViewSet

app_name = 'api_checklist'
urlpatterns = []

router = DefaultRouter()
router.register('group/item', ItemViewSet, basename='item')
router.register('group', GroupViewSet, basename='group')
router.register('', CheckListViewSet, basename='checklist')
urlpatterns += router.urls