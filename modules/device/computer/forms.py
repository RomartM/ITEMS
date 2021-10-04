import json

from django import forms
from django.contrib.admin.widgets import RelatedFieldWidgetWrapper
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import ManyToOneRel
from django.forms import RadioSelect

from apps.checklist.models import Item, Remark
from modules.device.computer.models import ComputerCheckList, ComputerSetting


class ComputerCheckListForm(forms.ModelForm):
    class Meta:
        model = ComputerCheckList
        exclude = ['checklist']

    def __init__(self, *args, **kwargs):
        super(ComputerCheckListForm, self).__init__(*args, **kwargs)
        data_store = None
        checklist_items = Item.objects.filter(group__checklist__id=ComputerSetting.objects.get().check_list_id)
        instance = kwargs.get('instance')

        if hasattr(instance, 'data'):
            data_store = json.loads(instance.data)

        for item in checklist_items:
            field_type = 'field_type_%s' % item.id
            field_remarks = 'field_remark_%s' % item.id

            self.fields['field_label_%s' % item.id] = forms.CharField(required=False, help_text='Description', label=item.name)
            self.fields[field_type] = forms.CharField(required=True, help_text='Type', label='', widget=RadioSelect(
                choices=[
                    ('repair', 'Repair'),
                    ('ok', 'OK'),
                ]
            ))
            self.fields[field_remarks] = forms.ModelChoiceField(queryset=Remark.objects.filter(enable=True),
                                                                help_text='Remarks', label='')
            rel = ManyToOneRel('', Remark, 'id')
            self.fields[field_remarks].widget = RelatedFieldWidgetWrapper(self.fields[field_remarks].widget, rel,
                                                                          self.admin_site, can_change_related=True)
            # Fill initial data
            if data_store:
                self.initial[field_type] = data_store.get(field_type, [''])[0]
                self.initial[field_remarks] = data_store.get(field_remarks, [''])[0]

    def save(self, commit=True):
        instance = super(ComputerCheckListForm, self).save(commit=False)
        to_remove = ['csrfmiddlewaretoken', 'quarter', 'schedule_0', 'schedule_1', 'device', 'conforme', 'evaluator',
                     'attested', '_continue']
        initial_data = dict(self.data)

        for key in to_remove:
            try:
                initial_data.pop(key)
            except:
                continue

        instance.data = json.dumps(initial_data, sort_keys=True, indent=1, cls=DjangoJSONEncoder)
        if commit:
            instance.save()
        return instance
