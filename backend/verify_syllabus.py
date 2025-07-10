#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, CourseSyllabus, SyllabusItem

def verify_syllabus():
    """Verify that all courses have comprehensive syllabus"""
    
    courses = Course.objects.all()
    print(f"Checking syllabus for {courses.count()} courses...\n")
    
    courses_with_5_plus_modules = 0
    total_modules = 0
    total_items = 0
    
    for course in courses:
        modules = CourseSyllabus.objects.filter(course=course)
        module_count = modules.count()
        
        items_count = 0
        for module in modules:
            items_count += SyllabusItem.objects.filter(module=module).count()
        
        print(f"{course.title}:")
        print(f"  -> {module_count} modules, {items_count} items")
        
        if module_count >= 5:
            courses_with_5_plus_modules += 1
        
        total_modules += module_count
        total_items += items_count
    
    print(f"\nSummary:")
    print(f"- Total courses: {courses.count()}")
    print(f"- Courses with 5+ modules: {courses_with_5_plus_modules}/{courses.count()}")
    print(f"- Total modules: {total_modules}")
    print(f"- Total syllabus items: {total_items}")
    print(f"- Average modules per course: {total_modules/courses.count():.1f}")
    print(f"- Average items per course: {total_items/courses.count():.1f}")

if __name__ == '__main__':
    verify_syllabus()