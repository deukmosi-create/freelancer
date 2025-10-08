import os
import sys
import django

# Add the parent directory (repo root) to Python path so 'core' can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Run migrations
from django.core.management import execute_from_command_line
execute_from_command_line(['django-admin', 'migrate', '--noinput'])