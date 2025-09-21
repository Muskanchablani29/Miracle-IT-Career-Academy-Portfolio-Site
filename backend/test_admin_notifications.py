import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Announcement, Notification

User = get_user_model()

# Test admin notifications
admin_users = User.objects.filter(is_staff=True)
print(f"Admin users: {admin_users.count()}")

for admin in admin_users:
    notifications = Notification.objects.filter(user=admin)
    print(f"Admin {admin.username} has {notifications.count()} notifications")

# Test announcements
announcements = Announcement.objects.all()
print(f"Total announcements: {announcements.count()}")

for announcement in announcements[:3]:
    print(f"- {announcement.title} by {announcement.created_by.username}")