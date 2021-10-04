from django.urls import path
from knox import views as knox_views
from rest_framework.authtoken.views import obtain_auth_token

from core.user.api.views import LoginAPI, SessionAuthToken

app_name = 'auth'
urlpatterns = [
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),
    path('obtain/', obtain_auth_token, name='obtain_by_credential'),
    path('obtain-session/', SessionAuthToken.as_view(), name='obtain_by_session'),
]
