from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

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
