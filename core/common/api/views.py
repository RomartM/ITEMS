from django.templatetags.static import static
from django.urls import reverse_lazy
from rest_framework import permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def overview(request):
    if request.method == 'GET':
        data = [
            {'label': 'Computer', 'enable': True, 'icon': static('svg/icon-devices-pc.svg'), 'href': reverse_lazy('device:computer:dashboard')},
            {'label': 'Printer', 'enable': False, 'icon': static('svg/icon-printer.svg'), 'href': '#'},
            {'label': 'Server', 'enable': False, 'icon': static('svg/icon-terminal-2.svg'), 'href': '#'},
        ]
        return Response(data)