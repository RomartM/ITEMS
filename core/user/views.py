# Create your views here.
import json

from django.db.models import F
from django.shortcuts import render
from rest_framework.reverse import reverse_lazy
from django.urls import reverse_lazy as rl_django

from modules.computer.constants import CONTEXT
from modules.computer.models import ComputerDevice


def my_activities(request):

    context = CONTEXT
    objects = ComputerDevice.objects

    CONTEXT['context'] = json.dumps({
        'api': {
            'obtain': str(reverse_lazy('rest_auth:obtain_by_session', request=request)).replace('http://020d50d77cb2.ngrok.io', 'https://020d50d77cb2.ngrok.io'),
        },
        'table': {
            'api': {
                'source': str(reverse_lazy('rest_auth:activity-list', request=request)).replace('http://020d50d77cb2.ngrok.io', 'https://020d50d77cb2.ngrok.io'),
                'details': str(rl_django('device:computer:details', kwargs={'pk': 0}, )).replace('http://020d50d77cb2.ngrok.io', 'https://020d50d77cb2.ngrok.io')
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

    return render(request, 'my-activities.html', context)
