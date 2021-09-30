from django.contrib.admin.models import LogEntry
from django.contrib.auth import login
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import permissions, viewsets, mixins, filters
from rest_framework.authentication import SessionAuthentication
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializer import UserSerializerLite, UserSerializer, LogEntrySerializer
from core.user.models import User

from core.user.api.serializer import ClienteleSerializer, ClienteleSelectSerializer, OfficeSerializer, \
    OfficeSelectSerializer
from core.user.models import Clientele, Office


class SessionAuthToken(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, *args, **kwargs):
        token = AuthToken.objects.create(request.user, )[1]
        return Response({
            'token': token,
        })


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)


class LogEntryViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LogEntrySerializer
    queryset = LogEntry.objects.all()

    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['action_flag']
    search_fields = ['object_repr', 'change_message']
    ordering_fields = ['action_flag', 'action_time', 'object_repr']
    ordering = ['-action_time']

    def get_queryset(self):
        """
        This view should return a list of all the brands
        for the currently authenticated user.
        """
        return self.queryset.filter(user=self.request.user)


class UserViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user_queryset = User.objects.filter(
            is_active=True
        )

        search = request.GET.get('search', None)
        sort_by = request.GET.get('sort_by', None)
        sort = request.GET.get('sort', None)

        if request.user.profile.user_type.user_search:
            if search:
                user_queryset = user_queryset.filter(
                    Q(username__icontains=search) |
                    Q(first_name__icontains=search) |
                    Q(last_name__icontains=search) |
                    Q(profile__id_number__icontains=search)
                )

        if sort_by:
            allowed_sort = ['first_name', 'last_name', 'date_joined']
            if allowed_sort.__contains__(sort_by):
                if sort == 'dsc':
                    user_queryset = user_queryset.order_by('-%s' % sort_by)
                elif sort == 'asc':
                    user_queryset = user_queryset.order_by(sort_by)

        queryset = self.filter_queryset(user_queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = UserSerializerLite(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    @staticmethod
    def retrieve(request, pk=None):
        user_queryset = User.objects.filter(
            is_active=True
        )
        user = get_object_or_404(user_queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class ClienteleViewSet(viewsets.ModelViewSet):

    serializer_class = ClienteleSerializer
    queryset = Clientele.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'designation', 'contact_number']
    ordering_fields = ['pk', 'name', 'designation']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the type of equipments
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class ClienteleSelectViewSet(viewsets.ModelViewSet):

    pagination_class = None
    serializer_class = ClienteleSelectSerializer
    queryset = Clientele.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the type of equipments
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class OfficeViewSet(viewsets.ModelViewSet):

    serializer_class = OfficeSerializer
    queryset = Office.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['pk', 'name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the offices
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


class OfficeSelectViewSet(viewsets.ModelViewSet):

    pagination_class = None
    serializer_class = OfficeSelectSerializer
    queryset = Office.objects.all()
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the offices
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(enable=True)


