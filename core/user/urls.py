from django.urls import path, include

from core.user import views

app_name = 'user'
urlpatterns = [
    path('activity', views.activity, name='activity'),
    path('account', views.account, name='account'),
    path('api/', include('core.user.api.urls.user')),
]
