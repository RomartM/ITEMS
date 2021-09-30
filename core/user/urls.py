from django.urls import path

from users import views

app_name = 'users'
urlpatterns = [
    path('my-activities', views.my_activities, name='my_activities'),
]
