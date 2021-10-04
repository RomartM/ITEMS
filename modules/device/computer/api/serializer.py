from rest_framework import serializers

from apps.scheduler.models import Event
from modules.device.computer.models import ComputerDevice, ComputerRemark, ComputerCheckList


class ComputerRemarkSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source='name')
    value = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = ComputerRemark
        fields = ('label', 'value',)


class ComputerListSerializer(serializers.ModelSerializer):
    device_id = serializers.CharField(read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    office_name = serializers.CharField(source='office.name', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_designation = serializers.CharField(source='user.designation', read_only=True)

    class Meta:
        model = ComputerDevice
        fields = ('pk', 'device_id', 'brand', 'brand_name', 'model', 'equipment_type', 'equipment_type_other', 'mac_address',
                  'serial', 'office', 'office_name', 'user', 'user_name', 'user_designation', 'unit_cost',
                  'date_acquired',)


class ComputerCheckListSerializer(serializers.ModelSerializer):
    scheduler = serializers.CharField(read_only=True)
    schedule = serializers.DateTimeField(read_only=True)
    schedule_formatted = serializers.DateTimeField(source='schedule', read_only=True, format='%b %d, %Y, %H:%M')
    event = serializers.CharField(read_only=True)
    technician = serializers.CharField(read_only=True)
    technician_name = serializers.CharField(source='technician.get_full_name', read_only=True)
    conforme = serializers.CharField(read_only=True)
    evaluator = serializers.CharField(read_only=True)
    attested = serializers.CharField(read_only=True)
    status = serializers.CharField(source='get_status', read_only=True)

    class Meta:
        model = ComputerCheckList
        fields = ('pk', 'technician', 'event', 'technician_name', 'scheduler', 'device', 'data', 'schedule', 'schedule_formatted',
                  'conforme', 'evaluator', 'attested', 'status')

    def validate(self, data):

        device = data.get('device')
        event_id = self.context.get("event_id")
        event_instance = Event.objects.filter(pk=event_id)

        # Validate if there is ongoing event
        if not event_instance.exists():
            raise serializers.ValidationError('No active schedule at the moment')

        # Validate if submission is not excessive
        if device.get_current_submitted().count() > event_instance.first().no_items:
            raise serializers.ValidationError('Maximum number of submission reached.')

        return data
        # Validates if already submitted

