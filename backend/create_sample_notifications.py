import os
import django
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Notification, Course, CourseEnrollment

User = get_user_model()

def create_sample_notifications():
    # Get all students (users who are not staff)
    students = User.objects.filter(is_staff=False, is_superuser=False)
    
    # Get a faculty member to create notifications from
    faculty = User.objects.filter(is_staff=True).first()
    if not faculty:
        print("No faculty found, creating admin notifications")
        faculty = User.objects.filter(is_superuser=True).first()
    
    if not faculty:
        print("No admin/faculty found, skipping notification creation")
        return
    
    # Sample notifications for all students
    sample_notifications = [
        {
            'title': 'Welcome to Miracle IT Career Academy!',
            'message': 'Welcome to your learning journey! Complete your profile and explore courses to get started.',
        },
        {
            'title': 'New Assignment Posted',
            'message': 'A new assignment has been posted in your enrolled courses. Check your dashboard for details.',
        },
        {
            'title': 'Upcoming Workshop',
            'message': 'Join our upcoming workshop on Advanced Web Development this weekend. Register now!',
        },
        {
            'title': 'Payment Reminder',
            'message': 'Your next installment payment is due in 3 days. Please make the payment to continue your courses.',
        },
        {
            'title': 'Achievement Unlocked!',
            'message': 'Congratulations! You have completed 50% of your course. Keep up the great work!',
        }
    ]
    
    created_count = 0
    for student in students:
        for i, notif_data in enumerate(sample_notifications):
            # Create notification if it doesn't exist
            notification, created = Notification.objects.get_or_create(
                user=student,
                title=notif_data['title'],
                defaults={
                    'message': notif_data['message'],
                }
            )
            if created:
                created_count += 1
    
    print(f"Created {created_count} sample notifications for {students.count()} students")

if __name__ == '__main__':
    create_sample_notifications()