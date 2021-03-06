# Generated by Django 3.2.4 on 2021-10-01 08:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('scheduler', '0002_initial'),
        ('checklist', '0002_initial'),
        ('computer', '0003_computersetting_enable'),
    ]

    operations = [
        migrations.AlterField(
            model_name='computerchecklist',
            name='checklist',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='checklist.checklist'),
        ),
        migrations.AlterField(
            model_name='computerchecklist',
            name='scheduler',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='scheduler.scheduler'),
        ),
        migrations.AlterField(
            model_name='historicalcomputerchecklist',
            name='checklist',
            field=models.ForeignKey(blank=True, db_constraint=False, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='checklist.checklist'),
        ),
        migrations.AlterField(
            model_name='historicalcomputerchecklist',
            name='scheduler',
            field=models.ForeignKey(blank=True, db_constraint=False, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='scheduler.scheduler'),
        ),
    ]
