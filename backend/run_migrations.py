import os
import sys
import django

# Add the PARENT directory (repo root) to Python path so 'core' can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Use 'settings' because we're running FROM the backend/ folder
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from django.core.management import execute_from_command_line
execute_from_command_line(['django-admin', 'migrate', '--noinput'])