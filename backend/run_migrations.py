import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')  # Points to backend/settings.py
django.setup()

# Run migrations using django-admin (since manage.py is outside)
from django.core.management import execute_from_command_line
execute_from_command_line(['django-admin', 'migrate', '--noinput'])