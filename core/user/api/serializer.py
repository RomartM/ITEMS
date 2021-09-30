from rest_framework import serializers

from core.user.models import User, Clientele, Office
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION, ACTION_FLAG_CHOICES


class ChoiceField(serializers.ChoiceField):

    def to_representation(self, obj):
        if obj == '' and self.allow_blank:
            return obj
        return self._choices[obj]

    def to_internal_value(self, data):
        # To support inserts with the value
        if data == '' and self.allow_blank:
            return ''

        for key, val in self._choices.items():
            if val == data:
                return key
        self.fail('invalid_choice', input=data)


class LogEntrySerializer(serializers.ModelSerializer):
    action_flag_name = ChoiceField(source='action_flag', read_only=True, choices=ACTION_FLAG_CHOICES)
    action_time_formatted = serializers.DateTimeField(source='action_time', read_only=True, format='%b %d, %Y, %H:%M')

    class Meta:
        model = LogEntry
        fields = ('action_time', 'action_time_formatted', 'user', 'content_type', 'object_id', 'object_repr', 'action_flag', 'action_flag_name', 'change_message')


class UserSerializerLite(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('pk', 'email', 'first_name', 'last_name', 'role', 'contact_number')


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('pk', 'email', 'first_name', 'last_name', 'role', 'contact_number')


class ClienteleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Clientele
        fields = ('pk', 'name', 'designation', 'contact_number', 'enable')


class ClienteleSelectSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source='name')
    value = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = Clientele
        fields = ('label', 'value', 'designation', 'contact_number',)


class OfficeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Office
        fields = ('pk', 'name', 'enable')


class OfficeSelectSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source='name')
    value = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = Office
        fields = ('label', 'value',)
