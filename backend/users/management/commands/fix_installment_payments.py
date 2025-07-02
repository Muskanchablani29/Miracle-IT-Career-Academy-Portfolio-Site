from django.core.management.base import BaseCommand
from users.models import FeePayment, StudentInstallmentPayment, FeeInstallment

class Command(BaseCommand):
    help = 'Create StudentInstallmentPayment records for existing payments'

    def handle(self, *args, **options):
        payments = FeePayment.objects.filter(installment__isnull=True, status='success')
        self.stdout.write(f'Found {payments.count()} payments without installments')
        
        for payment in payments:
            student_fee = payment.student_fee
            installments = FeeInstallment.objects.filter(
                fee_structure=student_fee.fee_structure
            ).order_by('sequence')
            
            remaining_amount = float(payment.amount)
            self.stdout.write(f'Processing payment {payment.receipt_number} for Rs.{remaining_amount}')
            
            for installment in installments:
                if remaining_amount <= 0:
                    break
                    
                installment_amount = float(installment.amount)
                sip, created = StudentInstallmentPayment.objects.get_or_create(
                    student_fee=student_fee,
                    installment=installment,
                    defaults={
                        'amount_paid': 0,
                        'is_paid': False,
                        'payment_date': None
                    }
                )
                
                if not sip.is_paid and remaining_amount > 0:
                    if remaining_amount >= installment_amount:
                        sip.amount_paid = installment_amount
                        sip.is_paid = True
                        sip.payment_date = payment.payment_date
                        remaining_amount -= installment_amount
                    else:
                        sip.amount_paid = remaining_amount
                        remaining_amount = 0
                    
                    sip.save()
                    self.stdout.write(f'  Updated installment {installment.sequence}: paid={sip.is_paid}')
        
        self.stdout.write(self.style.SUCCESS('Migration completed successfully'))