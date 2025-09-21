import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Notification, Announcement

User = get_user_model()

# Get admin users
admin_users = User.objects.filter(is_staff=True)
print(f"Found {admin_users.count()} admin users")

# Get recent announcements
recent_announcements = Announcement.objects.all()[:4]
print(f"Found {recent_announcements.count()} announcements")

# Create admin notifications for recent announcements
for admin in admin_users:
    for announcement in recent_announcements:
        notification, created = Notification.objects.get_or_create(
            user=admin,
            title=f"Faculty Posted: {announcement.title}",
            defaults={
                'message': f"New announcement by {announcement.created_by.username} for {announcement.course.title if announcement.course else 'All Courses'}: {announcement.message[:100]}{'...' if len(announcement.message) > 100 else ''}"
            }
        )
        if created:
            print(f"Created notification for {admin.username}: {notification.title}")

print("Admin notifications created successfully!")