from rest_framework import serializers

from core.corrective.models import RequestType, ServiceRequest


class RequestTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestType
        fields = ('pk', 'name', 'description', 'enable', 'has_status', 'has_other',)


class ServiceRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceRequest
        fields = ('pk', 'user', 'office', 'device', 'request_type', 'request_type_status',
                  'other', 'brief_description', 'recommending_approval', 'approved_by', )

