from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, status, mixins, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from modules.device.computer.api.serializer import ComputerListSerializer, ComputerRemarkSerializer, \
    ComputerCheckListSerializer
from modules.device.computer.models import ComputerDevice, ComputerRemark, ComputerCheckList, ComputerSetting


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def overview(request):
    if request.method == 'GET':
        data = [
            {'label': 'Conducted PM', 'count': 10},
            {'label': 'Queue SOD', 'count': 20},
            {'label': 'Ongoing SOD', 'count': 30},
            {'label': 'Completed SOD', 'count': 40},
        ]
        return Response(data)


class ComputerRemarkViewSet(viewsets.ModelViewSet):

    serializer_class = ComputerRemarkSerializer
    queryset = ComputerRemark.objects.all()
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


class ComputerViewSet(viewsets.ModelViewSet):

    serializer_class = ComputerListSerializer
    queryset = ComputerDevice.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['brand__id', 'equipment_type', 'office__id']
    search_fields = ['brand__name', 'model', 'mac_address', 'serial', 'device_id']
    ordering_fields = ['pk', 'brand__name', 'model', 'equipment_type', 'mac_address', 'office__name', 'user__first_name']
    ordering = ['pk']

    def get_queryset(self):
        """
        This view should return a list of all the type of equipments
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(enable=True)

    @action(detail=True)
    def get_overview(self, request, pk=None):
        device = self.get_object()
        return JsonResponse({
            'pk': pk,
            'pm_count': device.get_pm_count(),
            'sr_count': device.get_sr_count(),
            'so_count': device.get_so_count(),

            'information': [

                {'label': 'User Information', 'fields': [
                    {'label': 'Office Name/ Department', 'value': device.office.name},
                    {'label': 'PC User', 'value': device.user.name},
                    {'label': 'Contact Number', 'value': device.user.contact_number},
                    {'label': 'Position /Designation', 'value': device.user.designation},
                ]},
                {'label': 'Device Information', 'fields': [
                    {'label': 'PC ID', 'value': device.device_id},
                    {'label': 'Acquisition Date', 'value': device.date_acquired},
                    {'label': 'Type of Equipment', 'value': str(device.equipment_type).upper()},
                    {'label': 'Brand', 'value': device.brand.name},
                    {'label': 'Model', 'value': device.model},
                    {'label': 'Serial', 'value': device.serial},
                ]}
            ]
        }, status=201)


class ComputerCheckListViewSet(viewsets.ModelViewSet, mixins.CreateModelMixin):

    serializer_class = ComputerCheckListSerializer
    queryset = ComputerCheckList.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['device', 'event']
    search_fields = ['device__brand__name', 'device__model', 'device__mac_address', 'device__serial', 'device__device_id', 'technician__first_name', 'technician__email']
    ordering_fields = ['pk', 'schedule', 'event']
    ordering = ['-schedule']

    def get_queryset(self):
        """
        This view should return a list of all the type of equipments
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(enable=True)

    def create(self, request, format=None, **kwargs):

        event_id = ComputerSetting.objects.get().scheduler.get_ongoing_event().get('event', None)
        serializer = self.serializer_class(data=request.data, context={'event_id': event_id})

        if serializer.is_valid(self):
            if event_id:
                serializer.save(technician=self.request.user, event_id=event_id)
                return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
