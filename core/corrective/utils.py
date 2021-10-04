from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.fields import AutoCreatedField, AutoLastModifiedField


class IndexedTimeStampedModel(models.Model):
    created = AutoCreatedField(_("created"), db_index=True)
    modified = AutoLastModifiedField(_("modified"), db_index=True)

    class Meta:
        abstract = True


class HistorySurveillance(models.Model):
    history_instance = models.IntegerField(null=True, blank=True, editable=False)

    class Meta:
        abstract = True

    def save_without_historical_record(self, *args, **kwargs):
        self.skip_history_when_saving = True
        try:
            ret = self.save(*args, **kwargs)
        finally:
            del self.skip_history_when_saving
        return ret
