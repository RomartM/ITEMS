# Create your views here.
import json

from django.db.models import F
from django.shortcuts import render
from rest_framework.reverse import reverse_lazy
from django.urls import reverse_lazy as rl_django

# from modules.computer.constants import CONTEXT
# from modules.computer.models import ComputerDevice
from ITEMS.constants import CONTEXT


def activity(request):

    context = CONTEXT
    CONTEXT['page_title'] = 'Activity'
    # objects = ComputerDevice.objects
    #
    CONTEXT['context'] = json.dumps({
        'api': {
            'obtain': str(reverse_lazy('rest_user:obtain_by_session', request=request)),
        },
        'table': {
            'api': {
                'source': str(reverse_lazy('rest_user:activity-list', request=request)),
                # 'details': str(rl_django('device:computer:details', kwargs={'pk': 0}, ))
            },
            'filters': [
                {
                    'id': 'action_flag',
                    'label': 'Action Flag',
                    'filters': [
                        {'name': "Addition", 'id': 1},
                        {'name': "Change", 'id': 2},
                        {'name': "Deletion", 'id': 3},
                    ]
                },
            ]
        }
    })

    return render(request, 'activity.html', context)


def account(request):
    context = CONTEXT
    CONTEXT['page_title'] = 'Account'

    return render(request, 'account.html', context)
