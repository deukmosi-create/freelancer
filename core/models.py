from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models import Q
import uuid

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        
        # Auto-generate a unique username from email
        username = extra_fields.pop('username', None)
        if not username:
            username_base = email.split('@')[0]
            username = username_base
            counter = 1
            # Ensure username is unique
            while self.model.objects.filter(username=username).exists():
                username = f"{username_base}_{counter}"
                counter += 1
        
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_activated = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    phone_verified = models.BooleanField(default=False)
    profile_picture = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    skills = models.JSONField(default=list)
    
    PAYMENT_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('airtel', 'Airtel Money'),
        ('paypal', 'PayPal'),
        ('bank', 'Bank Transfer'),
    ]
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, blank=True, null=True)
    payment_identifier = models.CharField(max_length=100, blank=True, null=True)
    oauth_provider = models.CharField(max_length=20, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    skills_required = models.JSONField(default=list)
    location = models.CharField(max_length=100, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_tasks')
    created_at = models.DateTimeField(auto_now_add=True)


class Application(models.Model):
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'task')


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)