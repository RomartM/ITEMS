from ITEMS.module_url_registration import register_module_url

app_name = 'preventive'
urlpatterns = []

# Device Module Registration
urlpatterns = register_module_url(app_name, urlpatterns)
