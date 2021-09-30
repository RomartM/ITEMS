from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from apps.checklist.api.serializer import ChecklistSerializer, GroupSerializer, ItemSerializer
from apps.checklist.models import CheckList, Group, Item


class CheckListViewSet(viewsets.ModelViewSet):

    serializer_class = ChecklistSerializer
    queryset = CheckList.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['pk', 'name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the checklists
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class GroupViewSet(viewsets.ModelViewSet):

    serializer_class = GroupSerializer
    queryset = Group.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['pk', 'name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the checklist groups
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class ItemViewSet(viewsets.ModelViewSet):

    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['pk', 'name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the checklist items
        for the currently authenticated user.
        """
        user = self.request.user

        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)
