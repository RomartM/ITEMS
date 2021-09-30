from rest_framework import serializers

from apps.scheduler.models import Event, Scheduler


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = ('pk', 'name', 'order', 'enable', 'months', 'no_items',)



class SchedulerSerializer(serializers.ModelSerializer):
    events = EventSerializer(read_only=True, many=True)
    ongoing = serializers.JSONField(source='get_ongoing_event')

    class Meta:
        model = Scheduler
        fields = ('pk', 'name', 'enable', 'events', 'ongoing')
