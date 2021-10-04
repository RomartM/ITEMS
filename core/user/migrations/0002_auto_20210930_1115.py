# Generated by Django 3.2.4 on 2021-09-30 03:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Clientele',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('history_instance', models.IntegerField(blank=True, editable=False, null=True)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('designation', models.CharField(blank=True, default='N/A', max_length=100)),
                ('contact_number', models.CharField(blank=True, max_length=30)),
                ('enable', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='historicaluser',
            name='designation',
        ),
        migrations.RemoveField(
            model_name='user',
            name='designation',
        ),
        migrations.AlterField(
            model_name='historicaluser',
            name='role',
            field=models.CharField(choices=[('clientele', 'Clientele'), ('technician', 'Technician'), ('attendant', 'Attendant')], default='clientele', max_length=30),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('clientele', 'Clientele'), ('technician', 'Technician'), ('attendant', 'Attendant')], default='clientele', max_length=30),
        ),
        migrations.CreateModel(
            name='HistoricalClientele',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=100)),
                ('designation', models.CharField(blank=True, default='N/A', max_length=100)),
                ('contact_number', models.CharField(blank=True, max_length=30)),
                ('enable', models.BooleanField(default=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical clientele',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.AddField(
            model_name='historicaluser',
            name='linked_clientele',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='user.clientele'),
        ),
        migrations.AddField(
            model_name='user',
            name='linked_clientele',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='user.clientele'),
        ),
    ]