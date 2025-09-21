import os
import django
import sys
import random
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Student

User = get_user_model()

def create_sample_attendance_data():
    """Create sample attendance data for students"""
    students = Student.objects.all()
    print(f"Found {students.count()} students")
    
    total_attendance = 0
    student_count = 0
    
    for student in students:
        # Generate random attendance percentage between 75-95%
        attendance_rate = random.randint(75, 95)
        total_attendance += attendance_rate
        student_count += 1
        
        # You could store this in a separate attendance model if needed
        print(f"Student {student.user.username}: {attendance_rate}% attendance")
    
    if student_count > 0:
        average_attendance = total_attendance / student_count
        print(f"\nOverall average attendance: {average_attendance:.1f}%")
        return average_attendance
    
    return 0

if __name__ == '__main__':
    avg_attendance = create_sample_attendance_data()
    print(f"Sample attendance data created. Average: {avg_attendance:.1f}%")