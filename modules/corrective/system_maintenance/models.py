# from django.db import models
# from solo.models import SingletonModel
#
# from core.corrective.models import ServiceOrderAbstract
# from core.corrective.utils import HistorySurveillance
# from core.user.models import Clientele, User
#
#
# class Settings(SingletonModel):
#     enable = models.BooleanField(default=True, help_text='Enable Service Order Form')
#
#     def __str__(self):
#         return "Settings"
#
#     class Meta:
#         verbose_name = "Settings"
#
#
# class TSRAbstract(HistorySurveillance):
#     technician = models.ForeignKey(User, on_delete=models.CASCADE)
#     date = models.DateTimeField(auto_now=True)
#
#     class Meta:
#         abstract = True
#
#
# class ReceivedDataset(TSRAbstract):
#     pc = models.BooleanField()
#     pc_types = models.CharField(choices=(
#         ('desktop', 'Desktop'),
#         ('all-in-one', 'All-in-One'),
#         ('laptop', 'Laptop'),
#     ))
#     printer = models.BooleanField()
#     printer_types = models.CharField(choices=(
#         ('inkjet', 'Inkjet'),
#         ('laser', 'Laser'),
#         ('dot-matrix', 'Dot Matrix'),
#     ))
#     others = models.BooleanField()
#     others_field = models.CharField(max_length=80)
#     accessories_incl = models.BooleanField()
#     accessories_incl_field = models.TextField()
#
#
# class DiagnosticDataset(TSRAbstract):
#     action_taken = models.TextField()
#
#
# class AssessmentDataset(TSRAbstract):
#     findings = models.TextField()
#
#
# class ReleasedDataset(TSRAbstract):
#     remarks = models.TextField()
#
#
# class ClientVSRDataset(HistorySurveillance):
#     status_after_service = models.CharField(max_length=90, name='Status of the Equipment after service')
#     clientele = models.ForeignKey(Clientele, on_delete=models.CASCADE, name='Clientele')
#     clientele_verification = models.BooleanField(default=False, name='Clientele Verification')
#     date = models.DateTimeField(auto_now=True, name='Date')
#
#
# class TechnicalServiceReport(ServiceOrderAbstract):
#     received_dataset = models.OneToOneField(ReceivedDataset, on_delete=models.CASCADE)
#     diagnostic_dataset = models.OneToOneField(DiagnosticDataset, on_delete=models.CASCADE)
#     assessment_dataset = models.OneToOneField(AssessmentDataset, on_delete=models.CASCADE)
#     released_dataset = models.OneToOneField(ReleasedDataset, on_delete=models.CASCADE)
#     client_vsr_dataset = models.OneToOneField(ClientVSRDataset, on_delete=models.CASCADE)
