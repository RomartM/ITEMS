import os
from importlib import import_module

from django.urls import include, path

from ITEMS.settings import MODULES_DIR


def register_module_url(parent_app_name, urlpatterns):
    _variety_dir = MODULES_DIR % parent_app_name
    for module in os.listdir(_variety_dir):
        if os.path.isdir(os.path.join(_variety_dir, module)):
            module_name = 'modules.%s.%s' % (parent_app_name, module)
            try:
                _module = import_module('%s.urls' % module_name)
            except:
                pass
            else:
                urlpatterns.append(path('modules/%s/' % module, include('%s.urls' % module_name)))
    return urlpatterns


def get_module_name(parent_app_name):
    _variety_dir = MODULES_DIR % parent_app_name

    return os.listdir(_variety_dir)

