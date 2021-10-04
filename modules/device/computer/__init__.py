
def get_info():
    from django.templatetags.static import static
    from django.urls import reverse_lazy
    from .models import ComputerSetting

    return {
        'label': 'Computer',
        'enable': ComputerSetting.get_solo().enable,
        'icon': static('app/svg/icon-devices-pc.svg'),
        'href': reverse_lazy('device:computer:dashboard'),
    }
