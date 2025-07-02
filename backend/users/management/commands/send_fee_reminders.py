from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from users.models import Student, StudentFee, FeeInstallment, StudentInstallmentPayment, StudentNotification

class Command(BaseCommand):
    help = 'Send fee reminder notifications to students'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=7,
            help='Number of days before due date to send reminder (default: 7)'
        )

    def handle(self, *args, **options):
        days_ahead = options['days']
        target_date = date.today() + timedelta(days=days_ahead)
        
        self.stdout.write(f'Checking for installments due on {target_date}...')
        
        # Get all installments due on target date
        due_installments = FeeInstallment.objects.filter(due_date=target_date)
        
        notifications_sent = 0
        
        for installment in due_installments:
            # Get all students with this fee structure
            student_fees = StudentFee.objects.filter(fee_structure=installment.fee_structure)
            
            for student_fee in student_fees:
                # Check if this installment is already paid
                installment_payment = StudentInstallmentPayment.objects.filter(
                    student_fee=student_fee,
                    installment=installment,
                    is_paid=True
                ).first()
                
                if not installment_payment:
                    # Create notification
                    title = f"Fee Installment Due in {days_ahead} Days"
                    message = f"Your installment #{installment.sequence} of ₹{installment.amount} is due on {installment.due_date.strftime('%B %d, %Y')}. Please make your payment to avoid late fees."
                    
                    # Check if notification already exists
                    existing_notification = StudentNotification.objects.filter(
                        student=student_fee.student,
                        title=title,
                        created_at__date=date.today()
                    ).first()
                    
                    if not existing_notification:
                        StudentNotification.objects.create(
                            student=student_fee.student,
                            title=title,
                            message=message,
                            notification_type='installment_due',
                            is_popup=True
                        )
                        notifications_sent += 1
                        
                        self.stdout.write(
                            f'Sent reminder to {student_fee.student.user.username} for installment #{installment.sequence}'
                        )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully sent {notifications_sent} fee reminder notifications')
        )