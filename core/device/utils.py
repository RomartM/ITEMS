from django.db import models


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
