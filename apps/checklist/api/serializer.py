from rest_framework import serializers

from apps.checklist.models import CheckList, Group, Item


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ('pk', 'name', 'enable')


class GroupSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True, many=True)

    class Meta:
        model = Group
        fields = ('pk', 'name', 'enable', 'item',)


class ChecklistSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(read_only=True, many=True)

    class Meta:
        model = CheckList
        fields = ('pk', 'name', 'enable', 'groups',)
