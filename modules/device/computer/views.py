import json

from django.contrib.auth.decorators import login_required
from django.db.models import F
from django.http import Http404
from django.shortcuts import render
from rest_framework.reverse import reverse_lazy
from django.urls import reverse_lazy as rl_django

from modules.device.computer.constants import CONTEXT, COMPUTER_EQUIPMENT_TYPE
from modules.device.computer.models import ComputerDevice, ComputerCheckList, ComputerSetting


@login_required
def dashboard(request):
    context = CONTEXT
    objects = ComputerDevice.objects

    CONTEXT['page_title'] = 'Computer'
    CONTEXT['context'] = json.dumps({
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
        },
        'overview': {
            'api': {
                'source': str(reverse_lazy('device:computer:api:overview', request=request)),
            }
        },
        'table': {
            'api': {
                'source': str(reverse_lazy('device:computer:api:computer-list', request=request)),
                'details': str(rl_django('device:computer:details', kwargs={'pk': 0}, ))
            },
            'filters': [
                {
                    'id': 'brand',
                    'label': 'Brand',
                    'filters': list(objects.values('brand__id', 'brand__name').distinct().annotate(
                        name=F('brand__name'), id=F('brand_id')
                    ).values('name', 'id'))
                },
                {
                    'id': 'equipment_type',
                    'label': 'Equipment Type',
                    'filters': list(objects.values('equipment_type').distinct().annotate(
                        name=F('equipment_type'), id=F('equipment_type')
                    ).values('name', 'id'))
                },
                {
                    'id': 'office',
                    'label': 'Office',
                    'filters': list(objects.values('office__id', 'office__name').distinct().annotate(
                        name=F('office__name'), id=F('office__id')
                    ).values('name', 'id'))
                },
            ]
        }
    })

    return render(request, 'computer-dashboard.html', context)


"""
Devices
"""


@login_required
def pc(request):
    return render(request, 'computer-device.html')


@login_required
def new(request):
    context = CONTEXT

    CONTEXT['page_title'] = 'Register New Computer'
    CONTEXT['context'] = json.dumps({
        'const': {
            'equipment_type': json.dumps(COMPUTER_EQUIPMENT_TYPE),
        },
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
            'user': str(reverse_lazy('user:api:user_select-list', request=request)),
            'office': str(reverse_lazy('user:api:office_select-list', request=request)),
            'brand': str(reverse_lazy('device:api_device:brand_select-list', request=request)),
            'device': str(reverse_lazy('device:computer:api:computer-list', request=request)),
        },
    })

    return render(request, 'computer-device-new.html', context)


@login_required
def edit(request, pk):
    context = CONTEXT
    device = ComputerDevice.objects.filter(id=pk)

    if not device:
        raise Http404

    context['obj'] = device.first()
    # Edit | PC #{{ obj.device_id }} - {{ obj }}
    CONTEXT['page_title'] = 'Edit | PC #%s - %s' % (context['obj'].device_id, context['obj'])
    CONTEXT['context'] = json.dumps({
        'const': {
            'equipment_type': json.dumps(COMPUTER_EQUIPMENT_TYPE),
        },
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
            'user': str(reverse_lazy('user:api:user_select-list', request=request)),
            'office': str(reverse_lazy('user:api:office_select-list', request=request)),
            'brand': str(reverse_lazy('device:api_device:brand_select-list', request=request)),
        },
        'data': str(reverse_lazy('device:computer:api:computer-detail', request=request, kwargs={'pk': pk})),
        'data2': str(reverse_lazy('device:computer:details', request=request, kwargs={'pk': pk}))
    })

    return render(request, 'computer-device-edit.html', context)


@login_required
def details(request, pk):
    context = CONTEXT
    device = ComputerDevice.objects.filter(id=pk)

    if not device:
        raise Http404

    context['obj'] = device.first()
    CONTEXT['page_title'] = 'Details - %s' % 'test'
    context['context'] = json.dumps({
        'pk': pk,
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
        },
        'changes-history-list': {

        },
        'repair-history-list': {

        },
        'cm-record-list': {

        },
        'pm-record-list': {
            'api': {
                'source': str(reverse_lazy('device:computer:api:checklist-list', request=request)),
                'details': str(rl_django('device:computer:details', kwargs={'pk': 0}, ))
            },
            'filters': {
                'quarter': list(ComputerSetting.objects.get().scheduler.events.values('name', 'id')) if hasattr(ComputerSetting.objects.get().scheduler, 'events') else {},
                'year': list(ComputerCheckList.objects.values('schedule__year').distinct())
            }
        },
        'pm-checklist': {
            'meta': {
                'current_submitted_count': context['obj'].get_current_submitted().count(),
                'last_submitted_event': context['obj'].get_last_submitted_event_id(),
            },
            'api': {
                'source': str(
                    reverse_lazy('checklist:api_checklist:checklist-detail', args=[ComputerSetting.objects.get().check_list_id],
                                 request=request)),
                'scheduler': str(
                    reverse_lazy('scheduler:api_scheduler:scheduler-detail', args=[ComputerSetting.objects.get().scheduler_id],
                                 request=request)),
                'data': str(reverse_lazy('device:computer:api:checklist-list', request=request)),
                'remark': str(reverse_lazy('device:computer:api:remark-list', request=request)),
            }

        },
        'pc-information': {
            'api': {
                'source': str(reverse_lazy('device:computer:api:computer-get-overview', args=[pk],
                                           request=request))
            }
        },
    })

    return render(request, 'computer-device-detail.html', context)


