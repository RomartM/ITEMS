from django.template.defaulttags import register


@register.filter
def has_role(user, group_id):
    return user.has_role(pk=group_id)
