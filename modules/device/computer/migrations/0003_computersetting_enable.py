# Generated by Django 3.2.4 on 2021-10-01 06:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('computer', '0002_auto_20211001_1106'),
    ]

    operations = [
        migrations.AddField(
            model_name='computersetting',
            name='enable',
            field=models.BooleanField(default=True, help_text='Enable Module'),
        ),
    ]
