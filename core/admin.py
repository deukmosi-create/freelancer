from django.contrib import admin
from .models import User, Task, Application, Bookmark, Message, Notification

# Register your models here
admin.site.register(User)
admin.site.register(Task)
admin.site.register(Application)
admin.site.register(Bookmark)
admin.site.register(Message)
admin.site.register(Notification)