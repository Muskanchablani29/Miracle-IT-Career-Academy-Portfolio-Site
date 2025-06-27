#!/usr/bin/env python3
"""
Debug script to check admin dashboard data and populate sample data if needed
"""

import os
import sys
import django
from datetime import date, timedelta
from decimal import Decimal

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Student, Faculty, Admin, FeeStructure, StudentFee, FeePayment
from courses.models import Course

User = get_user_model()

def check_dashboard_data():
    """Check current dashboard data"""
    print("=== CURRENT DASHBOARD DATA ===")
    
    # Count students
    student_count = Student.objects.count()
    print(f"Total Students: {student_count}")
    
    # Count faculty
    faculty_count = Faculty.objects.count()
    print(f"Total Faculty: {faculty_count}")
    
    # Count courses
    course_count = Course.objects.count()
    print(f"Total Courses: {course_count}")
    
    # Count fee payments
    total_fees = FeePayment.objects.filter(status='success').aggregate(
        total=django.db.models.Sum('amount')
    )['total'] or 0
    print(f"Total Fee Collection: Rs.{total_fees}")
    
    # Recent payments
    recent_payments = FeePayment.objects.filter(status='success').order_by('-payment_date')[:5]
    print(f"Recent Payments: {len(recent_payments)}")
    
    return {
        'students': student_count,
        'faculty': faculty_count,
        'courses': course_count,
        'fees': total_fees,
        'recent_payments': len(recent_payments)
    }

def create_sample_data():
    """Create sample data for testing"""
    print("\n=== CREATING SAMPLE DATA ===")
    
    try:
        # Create sample course if none exists
        if Course.objects.count() == 0:
            course = Course.objects.create(
                title="Full Stack Web Development",
                description="Complete web development course",
                price=50000,
                discount_price=40000,
                duration="6 months",
                level="Intermediate"
            )
            print(f"Created sample course: {course.title}")
        else:
            course = Course.objects.first()
            print(f"Using existing course: {course.title}")
        
        # Create admin user if none exists
        admin_user = None
        if not User.objects.filter(role='admin').exists():
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@example.com',
                password='admin123',
                role='admin'
            )
            Admin.objects.create(user=admin_user, is_super_admin=True)
            print("Created admin user")
        else:
            admin_user = User.objects.filter(role='admin').first()
            print("Using existing admin user")
        
        # Create faculty if none exists
        if Faculty.objects.count() == 0:
            faculty_user = User.objects.create_user(
                username='faculty1',
                email='faculty1@example.com',
                password='faculty123',
                role='faculty'
            )
            Faculty.objects.create(
                user=faculty_user,
                department="Computer Science",
                created_by=admin_user
            )
            print("Created sample faculty")
        
        # Create students if none exist
        if Student.objects.count() == 0:
            for i in range(5):
                student_user = User.objects.create_user(
                    username=f'student{i+1}',
                    email=f'student{i+1}@example.com',
                    password='student123',
                    role='student'
                )
                student = Student.objects.create(
                    user=student_user,
                    enrollment_id=f'STU{2024}{i+1:03d}',
                    course=course,
                    created_by=admin_user
                )
                print(f"Created student: {student.enrollment_id}")
        
        # Create fee structure if none exists
        if FeeStructure.objects.count() == 0:
            fee_structure = FeeStructure.objects.create(
                name="Standard Fee Structure",
                course=course,
                registration_fee=Decimal('5000'),
                tuition_fee=Decimal('35000'),
                total_amount=Decimal('40000'),
                installments=2,
                created_by=admin_user
            )
            print(f"Created fee structure: {fee_structure.name}")
        else:
            fee_structure = FeeStructure.objects.first()
        
        # Assign fees to students
        students = Student.objects.all()
        for student in students:
            if not StudentFee.objects.filter(student=student).exists():
                student_fee = StudentFee.objects.create(
                    student=student,
                    fee_structure=fee_structure,
                    total_amount=fee_structure.total_amount,
                    amount_paid=Decimal('0'),
                    assigned_by=admin_user
                )
                print(f"Assigned fee to student: {student.enrollment_id}")
        
        # Create some sample payments
        if FeePayment.objects.count() == 0:
            student_fees = StudentFee.objects.all()[:3]  # First 3 students
            for i, student_fee in enumerate(student_fees):
                payment_amount = Decimal('20000') if i == 0 else Decimal('15000')
                payment = FeePayment.objects.create(
                    student_fee=student_fee,
                    amount=payment_amount,
                    payment_mode='online',
                    transaction_id=f'TXN{2024}{i+1:03d}',
                    receipt_number=f'REC{2024}{i+1:03d}',
                    status='success',
                    remarks='Sample payment',
                    recorded_by=admin_user
                )
                print(f"Created payment: {payment.receipt_number} - Rs.{payment.amount}")
        
        print("\nSample data creation completed!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        import traceback
        traceback.print_exc()

def main():
    print("Dashboard Data Debug Tool")
    print("=" * 50)
    
    # Check current data
    current_data = check_dashboard_data()
    
    # If no data exists, create sample data
    if all(value == 0 for value in current_data.values()):
        print("\nNo data found. Creating sample data...")
        create_sample_data()
        
        # Check data again
        print("\n=== AFTER CREATING SAMPLE DATA ===")
        check_dashboard_data()
    else:
        print("\nData exists. Dashboard should show real numbers.")
    
    print("\n=== API ENDPOINT TESTS ===")
    print("You can test these endpoints:")
    print("1. http://localhost:8000/api/users/fee-reports/")
    print("2. http://localhost:8000/api/users/faculty/")
    print("3. http://localhost:8000/api/courses/courses/")
    print("4. http://localhost:8000/api/users/admin-notifications/")

if __name__ == "__main__":
    main()