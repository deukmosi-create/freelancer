import os
import django

# Point to backend.settings (since settings.py is in backend/)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import execute_from_command_line
execute_from_command_line(['manage.py', 'migrate', '--noinput'])