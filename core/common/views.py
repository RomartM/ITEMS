import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from rest_framework.reverse import reverse_lazy

from ITEMS.constants import CONTEXT


@login_required
def dashboard(request):
    context = CONTEXT

    context['context'] = json.dumps({
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
        },
        # 'device': {
        #     'api': {
        #         'source': str(reverse_lazy('common:api:overview', request=request)),
        #     }
        # },
        # 'sod-queue': {
        #     'api': {
        #         'source': str(reverse_lazy('device:computer:api:checklist-list', request=request)),
        #     }
        # },
    })
    return render(request, 'dashboard.html', context)


@login_required
def finder(request):
    context = CONTEXT

    context['page_title'] = 'Finder'
    context['context'] = json.dumps({
        'api': {
            'obtain': str(reverse_lazy('auth:obtain_by_session', request=request)),
        },
    })
    return render(request, 'finder.html', context)
