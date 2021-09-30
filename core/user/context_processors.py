from core.user.constants import CLIENTELE, TECHNICIAN, ATTENDANT


def user_meta(request):
    return {
        'USER_GROUP': {
            'CLIENTELE': CLIENTELE,
            'TECHNICIAN': TECHNICIAN,
            'ATTENDANT': ATTENDANT
        }
    }