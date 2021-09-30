import json

from django.shortcuts import render
from rest_framework.reverse import reverse_lazy

from ITEMS.constants import CONTEXT


def devices(request):

    context = CONTEXT

    CONTEXT['page_title'] = 'Devices'
    context['context'] = json.dumps({
        'api': {
            'obtain': str(reverse_lazy('rest_user:obtain_by_session', request=request)),
        },
        'device': {
            'api': {
                # 'source': str(reverse_lazy('common:api:overview', request=request)),
            }
        },
    })
    return render(request, 'device-list.html', context)
