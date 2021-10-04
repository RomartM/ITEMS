import os
from importlib import import_module

from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ITEMS.module_url_registration import get_module_name
from ITEMS.settings import MODULES_DIR
from core.device.api.serializer import BrandSerializer, DeviceSerializer, BrandSelectSerializer
from core.device.models import Brand, Device


class BrandViewSet(viewsets.ModelViewSet):

    serializer_class = BrandSerializer
    queryset = Brand.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['pk', 'name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the brands
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class BrandSelectViewSet(viewsets.ModelViewSet):

    pagination_class = None
    serializer_class = BrandSelectSerializer
    queryset = Brand.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the brands
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class DeviceViewSet(viewsets.ModelViewSet):

    serializer_class = DeviceSerializer
    queryset = Device.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['brand', 'model', 'serial', 'mac_address']
    ordering_fields = ['pk', 'brand', 'date_acquired']
    ordering = ['brand']

    def get_queryset(self):
        """
        This view should return a list of all the devices
        for the currently authenticated user.
        """
        return self.queryset


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def available_devices(request):
    if request.method == 'GET':

        data = []

        parent_app_name = 'device'
        _variety_dir = MODULES_DIR % parent_app_name
        for module in os.listdir(_variety_dir):
            if os.path.isdir(os.path.join(_variety_dir, module)):
                module_name = 'modules.%s.%s' % (parent_app_name, module)
                try:
                    _module = import_module('%s' % module_name)
                except:
                    pass
                else:
                    if hasattr(_module, 'get_info'):
                        print(_module.get_info())
                        data.append(_module.get_info())

        # available_devices = get_module_name('device')
        #
        # for slug in available_devices:
        #     if slug[:2] != '__':
        #         print(slug)
        #         get_info()
        #         data.append({
        #             'label': '',
        #             'enable': '',
        #             'icon': '',
        #             'href': '',
        #         })
        # data = [
        #     # {'label': 'Computer', 'enable': True, 'icon': static('svg/icon-devices-pc.svg'), 'href': reverse_lazy('device:computer:dashboard')},
        #     # {'label': 'Printer', 'enable': False, 'icon': static('svg/icon-printer.svg'), 'href': '#'},
        #     # {'label': 'Server', 'enable': False, 'icon': static('svg/icon-terminal-2.svg'), 'href': '#'},
        # ]
        return Response(data)
