from rest_framework import serializers

from core.user.api.serializer import OfficeSerializer, ClienteleSerializer
from core.device.models import Brand, Device


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = ('pk', 'name', 'enable')


class BrandSelectSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source='name')
    value = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = Brand
        fields = ('label', 'value',)


class DeviceSerializer(serializers.ModelSerializer):
    device_id = serializers.CharField(read_only=True)
    brand = BrandSerializer(read_only=True)
    office = OfficeSerializer(read_only=True)
    user = ClienteleSerializer(read_only=True)

    class Meta:
        model = Device
        fields = ('pk', 'device_id', 'user', 'office', 'brand',
                  'model', 'date_acquired', 'unit_cost',)

