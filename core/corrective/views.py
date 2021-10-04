import json

from django.http import Http404
from django.shortcuts import render
from rest_framework.reverse import reverse_lazy

from ITEMS.constants import CONTEXT
from core.device.models import Device


def issue_srf_by_pk(request, pk):
    context = CONTEXT

    device = Device.objects.filter(id=pk)

    if not device:
        raise Http404

    context['obj'] = device.first()

    CONTEXT['page_title'] = "Issue SRF"
    CONTEXT['context'] = json.dumps({
        'const': {
            # 'equipment_type': json.dumps(COMPUTER_EQUIPMENT_TYPE),
            'device_id': pk
        },
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
            'user': str(reverse_lazy('user:api:user_select-list', request=request)),
            'office': str(reverse_lazy('user:api:office_select-list', request=request)),
            'request_type': str(reverse_lazy('corrective:api_corrective:request_type-list', request=request)),
            'service_request': str(reverse_lazy('corrective:api_corrective:service_request-list', request=request)),
            'device': str(reverse_lazy('device:api_device:device-detail', request=request, kwargs={'pk': pk})),
        },
        # 'data': str(reverse_lazy('corrective:api_corrective:service_request-list', request=request, kwargs={'pk': pk})),
    })

    return render(request, 'issue_srf.html', context)


def issue_srf(request):
    context = CONTEXT

    CONTEXT['page_title'] = "Issue SRF"
    CONTEXT['context'] = json.dumps({
        'const': {
            # 'equipment_type': json.dumps(COMPUTER_EQUIPMENT_TYPE),
            # 'device_id': pk
        },
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
            'user': str(reverse_lazy('user:api:user_select-list', request=request)),
            'office': str(reverse_lazy('user:api:office_select-list', request=request)),
            'request_type': str(reverse_lazy('corrective:api_corrective:request_type-list', request=request)),
            'service_request': str(reverse_lazy('corrective:api_corrective:service_request-list', request=request)),
            # 'computer': str(reverse_lazy('device:computer:api:computer-detail', request=request, kwargs={'pk': pk})),
        },
        # 'data': str(reverse_lazy('api_corrective:service_request-list', request=request, kwargs={'pk': pk})),
    })

    return render(request, 'issue_srf.html', context)