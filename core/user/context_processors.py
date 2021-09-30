from users.constants import TECHNICAL, OFFICER


def user_meta(request):
    return {
        'USER_GROUP': {
            'TECHNICAL': TECHNICAL,
            'OFFICER': OFFICER
        }
    }