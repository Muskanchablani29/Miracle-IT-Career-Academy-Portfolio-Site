import os
import django
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Announcement, Course
from django.contrib.auth import get_user_model

User = get_user_model()

def create_sample_announcements():
    # Get or create a faculty user
    faculty_user, created = User.objects.get_or_create(
        username='faculty_demo',
        defaults={
            'email': 'faculty@miracleit.com',
            'first_name': 'Demo',
            'last_name': 'Faculty',
            'role': 'faculty'
        }
    )
    
    if created:
        faculty_user.set_password('password123')
        faculty_user.save()
        print(f"Created faculty user: {faculty_user.username}")
    
    # Get some courses
    courses = Course.objects.all()[:3]
    
    # Sample announcements
    announcements_data = [
        {
            'title': 'Midterm Exam Schedule Update',
            'message': 'Dear students, please note that the midterm exam for Web Development has been rescheduled from March 20 to March 22 due to unavoidable circumstances. The exam will be held from 10:00 AM to 12:00 PM in Room 301. Please prepare accordingly and reach out if you have any questions.',
            'priority': 'urgent',
            'course': courses[0] if courses else None
        },
        {
            'title': 'New Learning Resources Available',
            'message': 'I have uploaded additional study materials for the upcoming topics in React and Node.js. These include practice exercises, code examples, and reference guides that will help you better understand the concepts we will cover in the next few sessions.',
            'priority': 'important',
            'course': courses[1] if len(courses) > 1 else None
        },
        {
            'title': 'Guest Lecture on Industry Trends',
            'message': 'We are excited to announce a guest lecture by Mr. Rajesh Kumar, Senior Software Engineer at Google, on "Latest Trends in Full Stack Development". The session will be held on March 25, 2024, from 2:00 PM to 4:00 PM in the Main Auditorium. This is a great opportunity to learn from an industry expert.',
            'priority': 'normal',
            'course': None  # All courses
        },
        {
            'title': 'Project Submission Deadline Extended',
            'message': 'Based on student feedback and considering the complexity of the final project, I have decided to extend the submission deadline by one week. The new deadline is April 5, 2024, at 11:59 PM. Please use this additional time to enhance your projects and ensure all requirements are met.',
            'priority': 'important',
            'course': courses[2] if len(courses) > 2 else None
        },
        {
            'title': 'Weekly Code Review Sessions',
            'message': 'Starting next week, I will be conducting weekly code review sessions every Friday from 4:00 PM to 5:00 PM. These sessions are optional but highly recommended for improving your coding skills and getting personalized feedback on your projects.',
            'priority': 'normal',
            'course': courses[0] if courses else None
        }
    ]
    
    # Create announcements
    created_count = 0
    for data in announcements_data:
        announcement, created = Announcement.objects.get_or_create(
            title=data['title'],
            defaults={
                'message': data['message'],
                'priority': data['priority'],
                'course': data['course'],
                'created_by': faculty_user,
                'is_active': True
            }
        )
        
        if created:
            created_count += 1
            print(f"Created announcement: {announcement.title}")
    
    print(f"\nSample data creation completed!")
    print(f"Created {created_count} new announcements")
    print(f"Total announcements: {Announcement.objects.count()}")

if __name__ == '__main__':
    create_sample_announcements()