from django.urls import include, path

from ITEMS.module_url_registration import register_module_url
from core.corrective import views

app_name = 'corrective'
urlpatterns = [
    path('api/', include('core.corrective.api.urls')),
    path('issue-srf', views.issue_srf, name='issue_srf'),
    path('issue-srf/<int:pk>', views.issue_srf_by_pk, name='issue_srf_by_pk'),
]

# Device Module Registration
urlpatterns = register_module_url(app_name, urlpatterns)
