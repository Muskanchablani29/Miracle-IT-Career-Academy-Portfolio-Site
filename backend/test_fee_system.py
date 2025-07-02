#!/usr/bin/env python
"""
Test script for the updated fee management system
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import *
from django.utils import timezone
from datetime import timedelta

def test_notification_expiry():
    """Test notification expiry functionality"""
    print("Testing notification expiry...")
    
    # Create a test notification that should expire in 48 hours
    student = Student.objects.first()
    if student:
        notification = AdminNotification.objects.create(
            title="Test Payment Notification",
            message=f"Student {student.user.username} paid fees",
            notification_type='payment',
            student=student,
            amount=1000
        )
        print(f"Created notification: {notification.title}")
        print(f"Expires at: {notification.expires_at}")
        print(f"Is expired: {notification.is_expired()}")
    else:
        print("No students found for testing")

def test_installment_persistence():
    """Test installment payment persistence"""
    print("\nTesting installment payment persistence...")
    
    # Get a student with fee structure
    student_fee = StudentFee.objects.first()
    if student_fee:
        installments = FeeInstallment.objects.filter(fee_structure=student_fee.fee_structure)
        print(f"Student: {student_fee.student.user.username}")
        print(f"Total installments: {installments.count()}")
        
        for installment in installments:
            payment_status = StudentInstallmentPayment.objects.filter(
                student_fee=student_fee,
                installment=installment
            ).first()
            
            status = "Paid" if payment_status and payment_status.is_paid else "Unpaid"
            print(f"Installment {installment.sequence}: {status}")
    else:
        print("No student fees found for testing")

def test_receipt_storage():
    """Test receipt file storage"""
    print("\nTesting receipt storage...")
    
    payments = FeePayment.objects.all()[:3]
    for payment in payments:
        print(f"Receipt {payment.receipt_number}: File stored = {bool(payment.receipt_file)}")

if __name__ == "__main__":
    print("=== Fee Management System Test ===")
    test_notification_expiry()
    test_installment_persistence()
    test_receipt_storage()
    print("\n=== Test Complete ===")