# Generated by Django 3.2.4 on 2021-10-04 03:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('device', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='device',
            old_name='clientele',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='historicaldevice',
            old_name='clientele',
            new_name='user',
        ),
    ]
