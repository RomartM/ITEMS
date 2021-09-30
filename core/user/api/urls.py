from django.urls import path
from knox import views as knox_views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from users.api.views import UserViewSet, LoginAPI, SessionAuthToken, LogEntryViewSet

app_name = 'rest_auth'
urlpatterns = [
    path('login/', LoginAPI.as_view(), name='login'),
    path('obtain/', obtain_auth_token, name='obtain_by_credential'),
    path('session-obtain/', SessionAuthToken.as_view(), name='obtain_by_session'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),
]

router = DefaultRouter()
router.register('activity', LogEntryViewSet, basename='activity')
router.register('', UserViewSet, basename='user')
urlpatterns += router.urls
