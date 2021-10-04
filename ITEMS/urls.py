"""ITEMS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from importlib import import_module

from django.contrib import admin
from django.urls import path, include

from ITEMS.settings import MODULES_VARIETY, MODULES_DIR

urlpatterns = [
    path('admin/', admin.site.urls),

    # Frontend Core Apps
    path('', include('core.common.urls')),
    path('user/', include('core.user.urls')),
    path('device/', include('core.device.urls')),
    path('preventive/', include('core.preventive.urls')),
    path('corrective/', include('core.corrective.urls')),

    # Frontend Apps
    path('checklist/', include('apps.checklist.urls')),
    path('scheduler/', include('apps.scheduler.urls')),

    # Auth API Endpoints
    path('auth/api/', include('core.user.api.urls.auth')),
]



