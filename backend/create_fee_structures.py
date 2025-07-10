#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from users.models import FeeStructure, FeeInstallment, CustomUser

def create_fee_structures():
    """Create fee structures for all courses"""
    
    # Get admin user for created_by field
    admin_user = CustomUser.objects.filter(is_staff=True).first()
    if not admin_user:
        print("No admin user found. Creating default admin...")
        admin_user = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role='admin'
        )
    
    # Fee structure templates based on course type
    fee_templates = {
        'premium': {
            'registration_fee': Decimal('5000.00'),
            'tuition_fee': Decimal('45000.00'),
            'total_amount': Decimal('50000.00'),
            'installments': 4
        },
        'professional': {
            'registration_fee': Decimal('3000.00'),
            'tuition_fee': Decimal('27000.00'),
            'total_amount': Decimal('30000.00'),
            'installments': 3
        },
        'standard': {
            'registration_fee': Decimal('2000.00'),
            'tuition_fee': Decimal('18000.00'),
            'total_amount': Decimal('20000.00'),
            'installments': 2
        },
        'basic': {
            'registration_fee': Decimal('1000.00'),
            'tuition_fee': Decimal('9000.00'),
            'total_amount': Decimal('10000.00'),
            'installments': 2
        }
    }
    
    # Get all courses
    courses = Course.objects.all()
    
    for course in courses:
        print(f"Creating fee structure for: {course.title}")
        
        # Skip if fee structure already exists
        if FeeStructure.objects.filter(course=course).exists():
            print(f"  Warning: Fee structure already exists, skipping...")
            continue
        
        # Determine fee template based on course characteristics
        template_key = 'standard'  # default
        title_lower = course.title.lower()
        description_lower = course.description.lower()
        
        # Premium courses (AI/ML, Full Stack, Advanced topics)
        if any(keyword in title_lower for keyword in ['full stack', 'artificial intelligence', 'ai', 'machine learning', 'data science', 'cloud computing', 'devops']):
            template_key = 'premium'
        # Professional courses (Specialized development)
        elif any(keyword in title_lower for keyword in ['react', 'angular', 'node.js', 'python', 'java', 'aws', 'azure']):
            template_key = 'professional'
        # Basic courses (Fundamentals)
        elif any(keyword in title_lower for keyword in ['html', 'css', 'javascript basics', 'introduction', 'fundamentals']):
            template_key = 'basic'
        
        template = fee_templates[template_key]
        
        # Create fee structure
        fee_structure = FeeStructure.objects.create(
            name=f"{course.title} - Fee Structure",
            course=course,
            registration_fee=template['registration_fee'],
            tuition_fee=template['tuition_fee'],
            total_amount=template['total_amount'],
            installments=template['installments'],
            created_by=admin_user
        )
        
        # Create installments
        installment_amount = template['tuition_fee'] / template['installments']
        
        # First installment includes registration fee
        FeeInstallment.objects.create(
            fee_structure=fee_structure,
            amount=template['registration_fee'] + installment_amount,
            due_date='2024-01-15',  # Example due date
            sequence=1
        )
        
        # Remaining installments
        for i in range(2, template['installments'] + 1):
            due_month = i + 1
            due_date = f'2024-0{due_month}-15' if due_month < 10 else f'2024-{due_month}-15'
            
            FeeInstallment.objects.create(
                fee_structure=fee_structure,
                amount=installment_amount,
                due_date=due_date,
                sequence=i
            )
        
        print(f"  -> Created {template_key} fee structure: Rs.{template['total_amount']} with {template['installments']} installments")
    
    print(f"\nSuccessfully created fee structures for {courses.count()} courses!")

if __name__ == '__main__':
    create_fee_structures()