import json

from django.shortcuts import render
from rest_framework.reverse import reverse_lazy

from ITEMS.constants import CONTEXT
from ITEMS.module_url_registration import get_module_name


def devices(request):

    context = CONTEXT

    CONTEXT['page_title'] = 'Devices'
    context['context'] = json.dumps({
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
        },
        'device': {
            'api': {
                'source': str(reverse_lazy('device:api_device:available', request=request)),
            }
        },
    })

    return render(request, 'device-list.html', context)
