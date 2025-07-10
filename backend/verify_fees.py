#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from users.models import FeeStructure

def verify_fee_structures():
    """Verify fee structures for all courses"""
    
    courses = Course.objects.all()
    fee_structures = FeeStructure.objects.all()
    
    print(f"Total courses: {courses.count()}")
    print(f"Total fee structures: {fee_structures.count()}")
    print("\nCourses with fee structures:")
    
    courses_with_fees = 0
    total_revenue = 0
    
    for course in courses:
        fee = FeeStructure.objects.filter(course=course).first()
        if fee:
            print(f"- {course.title}: Rs.{fee.total_amount}")
            courses_with_fees += 1
            total_revenue += float(fee.total_amount)
        else:
            print(f"- {course.title}: No fee structure")
    
    print(f"\nSummary:")
    print(f"- Courses with fee structures: {courses_with_fees}/{courses.count()}")
    print(f"- Average course fee: Rs.{total_revenue/courses_with_fees:.2f}")
    print(f"- Total potential revenue: Rs.{total_revenue:.2f}")

if __name__ == '__main__':
    verify_fee_structures()