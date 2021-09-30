from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from apps.scheduler.api.serializer import EventSerializer, SchedulerSerializer
from apps.scheduler.models import Event, Scheduler


class EventViewSet(viewsets.ModelViewSet):

    pagination_class = None
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        This view should return a list of all the brands
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class SchedulerViewSet(viewsets.ModelViewSet):

    serializer_class = SchedulerSerializer
    queryset = Scheduler.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        This view should return a list of all the devices
        for the currently authenticated user.
        """
        return self.queryset
