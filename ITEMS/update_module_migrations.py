from django.core.management import call_command

call_command('makemigrations')
call_command('migrate')