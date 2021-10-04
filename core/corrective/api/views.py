from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from core.corrective.api.serializer import RequestTypeSerializer, ServiceRequestSerializer
from core.corrective.models import RequestType, ServiceRequest


class RequestTypeViewSet(viewsets.ModelViewSet):

    serializer_class = RequestTypeSerializer
    queryset = RequestType.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        """
        This view should return a list of all the offices
        for the currently authenticated user.
        """
        return self.queryset.order_by('order')


class ServiceRequestViewSet(viewsets.ModelViewSet):

    serializer_class = ServiceRequestSerializer
    queryset = ServiceRequest.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        """
        This view should return a list of all the offices
        for the currently authenticated user.
        """
        return self.queryset.all()