from django.template.defaulttags import register


@register.filter
def is_role(user, role):
    return user.is_role(role)
