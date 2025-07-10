from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import date
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

class Batch(models.Model):
    name = models.CharField(max_length=100)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='batches', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.course.title if self.course else 'No Course'}"

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    enrollment_id = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    admission_date = models.DateField(default=date.today)
    course = models.ForeignKey('courses.Course', on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    batch = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    created_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_students')

    def __str__(self):
        return f"{self.user.username} - {self.enrollment_id}"

class Faculty(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='faculty_profile')
    department = models.CharField(max_length=100, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_faculty')

class Admin(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='admin_profile')
    is_super_admin = models.BooleanField(default=False)

class Workshop(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='workshop_images/', null=True, blank=True)
    date = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    available_seats = models.IntegerField(default=0)
    category = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.title

class WorkshopRegistration(models.Model):
    EXPERIENCE_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )

    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, related_name='registrations')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    education = models.CharField(max_length=200, blank=True, null=True)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='beginner')
    special_requirements = models.TextField(blank=True, null=True)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.workshop.title}"

class Certificate(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField()
    duration = models.CharField(max_length=50)
    level = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class Holiday(models.Model):
    date = models.DateField(unique=True)
    name = models.CharField(max_length=100)
    is_government = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} - {self.date}"

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=date.today)
    is_present = models.BooleanField(default=True)
    login_time = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['student', 'date']
        
    def __str__(self):
        return f"{self.student.user.username} - {self.date} - {'Present' if self.is_present else 'Absent'}"

class Project(models.Model):
    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('archived', 'Archived'),
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.JSONField(default=list)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='projects')
    batch_name = models.CharField(max_length=100, blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='intermediate')
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_projects')
    
    def save(self, *args, **kwargs):
        if self.batch and not self.batch_name:
            self.batch_name = self.batch.name
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} - {self.batch_name}"

class ProjectSubmission(models.Model):
    STATUS_CHOICES = (
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='project_submissions')
    repository_url = models.URLField()
    live_url = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    grade = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    submission_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.enrollment_id} - {self.project.title}"

class StudentAchievement(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='achievements')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.student.enrollment_id} - {self.name}"

# Fee Management System Models
class FeeStructure(models.Model):
    name = models.CharField(max_length=100)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='fee_structures')
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tuition_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    installments = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_fee_structures')

    def __str__(self):
        return f"{self.name} - {self.course.title}"

class FeeInstallment(models.Model):
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.CASCADE, related_name='installments_list')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    sequence = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.fee_structure.name} - Installment {self.sequence}"
    
    class Meta:
        ordering = ['sequence']



class StudentFee(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
        ('partially_paid', 'Partially Paid'),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fees')
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.CASCADE, related_name='student_fees')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    assigned_date = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='assigned_fees')
    
    def __str__(self):
        return f"{self.student.user.username} - {self.fee_structure.name}"
    
    def save(self, *args, **kwargs):
        if self.amount_paid >= self.total_amount:
            self.status = 'paid'
        elif self.amount_paid > 0:
            self.status = 'partially_paid'
        else:
            self.status = 'unpaid'
        super().save(*args, **kwargs)

class StudentInstallmentPayment(models.Model):
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name='installment_payments')
    installment = models.ForeignKey(FeeInstallment, on_delete=models.CASCADE, related_name='student_payments')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    payment_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['student_fee', 'installment']
    
    def __str__(self):
        return f"{self.student_fee.student.user.username} - Installment {self.installment.sequence}"

class FeePayment(models.Model):
    PAYMENT_MODE_CHOICES = (
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('online', 'Online Payment'),
        ('check', 'Check'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('success', 'Success'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
    )
    
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name='payments')
    installment = models.ForeignKey(FeeInstallment, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(default=timezone.now)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    receipt_number = models.CharField(max_length=50, unique=True)
    receipt_file = models.FileField(upload_to='receipts/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='success')
    remarks = models.TextField(blank=True, null=True)
    recorded_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='recorded_payments')
    
    def __str__(self):
        return f"{self.receipt_number} - {self.student_fee.student.user.username}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.receipt_file:
            self.generate_receipt_file()
    
    def generate_receipt_file(self):
        try:
            from django.core.files.base import ContentFile
            import io
            
            try:
                from reportlab.pdfgen import canvas
                from reportlab.lib.pagesizes import A4
                
                buffer = io.BytesIO()
                p = canvas.Canvas(buffer, pagesize=A4)
                
                # Simple receipt generation
                p.drawString(100, 750, f"Receipt: {self.receipt_number}")
                p.drawString(100, 730, f"Student: {self.student_fee.student.user.username}")
                p.drawString(100, 710, f"Amount: Rs.{self.amount}")
                p.drawString(100, 690, f"Date: {self.payment_date.strftime('%d/%m/%Y')}")
                p.drawString(100, 670, f"Status: {self.status}")
                
                p.save()
                buffer.seek(0)
                
                receipt_content = ContentFile(buffer.getvalue())
                self.receipt_file.save(f'receipt-{self.receipt_number}.pdf', receipt_content, save=False)
                super().save(update_fields=['receipt_file'])
            except ImportError:
                # Fallback without reportlab
                pass
        except Exception as e:
            print(f"Error generating receipt: {e}")

class FeeDiscount(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    )
    
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name='discounts')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    reason = models.CharField(max_length=200)
    applied_date = models.DateTimeField(auto_now_add=True)
    applied_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='applied_discounts')
    
    def __str__(self):
        return f"{self.student_fee.student.user.username} - {self.amount} {self.get_discount_type_display()}"

class FeeFine(models.Model):
    student_fee = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name='fines')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=200)
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    applied_date = models.DateTimeField(auto_now_add=True)
    applied_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='applied_fines')
    
    def __str__(self):
        return f"{self.student_fee.student.user.username} - {self.amount}"

class AdminNotification(models.Model):
    NOTIFICATION_TYPES = (
        ('payment', 'Payment Received'),
        ('enrollment', 'New Enrollment'),
        ('system', 'System Alert'),
        ('fee_due', 'Fee Due Alert'),
        ('installment_payment', 'Installment Payment'),
    )
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    installment_number = models.IntegerField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    def save(self, *args, **kwargs):
        if not self.expires_at and self.notification_type in ['payment', 'installment_payment']:
            self.expires_at = self.created_at + timedelta(hours=48) if self.created_at else timezone.now() + timedelta(hours=48)
        super().save(*args, **kwargs)

class Assignment(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('archived', 'Archived'),
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='assignments')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='medium')
    due_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_assignments')
    
    def __str__(self):
        return f"{self.title} - {self.batch.name}"

class AssignmentSubmission(models.Model):
    STATUS_CHOICES = (
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('graded', 'Graded'),
    )
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='assignment_submissions')
    submission_text = models.TextField(blank=True, null=True)
    file_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    grade = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    submission_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.student.enrollment_id} - {self.assignment.title}"

class StudentNotification(models.Model):
    NOTIFICATION_TYPES = (
        ('fee_reminder', 'Fee Reminder'),
        ('installment_due', 'Installment Due'),
        ('payment_success', 'Payment Success'),
        ('assignment', 'Assignment'),
        ('general', 'General'),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    is_popup = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.title}"

@receiver(post_save, sender=FeePayment)
def update_student_fee_after_payment(sender, instance, created, **kwargs):
    if created and instance.status == 'success':
        student_fee = instance.student_fee
        # Update the amount_paid using F expression
        StudentFee.objects.filter(id=student_fee.id).update(
            amount_paid=models.F('amount_paid') + instance.amount
        )
        # Refresh from database to get updated values
        student_fee.refresh_from_db()
        
        # Update installment payment status if specific installment
        if instance.installment:
            StudentInstallmentPayment.objects.update_or_create(
                student_fee=student_fee,
                installment=instance.installment,
                defaults={
                    'amount_paid': instance.amount,
                    'is_paid': True,
                    'payment_date': instance.payment_date
                }
            )
        else:
            # Mark all installments as paid if full payment
            installments = FeeInstallment.objects.filter(fee_structure=student_fee.fee_structure).order_by('sequence')
            remaining_amount = float(instance.amount)
            for installment in installments:
                if remaining_amount <= 0:
                    break
                installment_payment, created = StudentInstallmentPayment.objects.get_or_create(
                    student_fee=student_fee,
                    installment=installment,
                    defaults={'amount_paid': 0, 'is_paid': False, 'payment_date': None}
                )
                if not installment_payment.is_paid:
                    installment_amount = float(installment.amount)
                    if remaining_amount >= installment_amount:
                        installment_payment.amount_paid = installment_amount
                        installment_payment.is_paid = True
                        installment_payment.payment_date = instance.payment_date
                        remaining_amount -= installment_amount
                    else:
                        installment_payment.amount_paid += remaining_amount
                        if installment_payment.amount_paid >= installment_amount:
                            installment_payment.is_paid = True
                            installment_payment.payment_date = instance.payment_date
                        remaining_amount = 0
                    installment_payment.save()
        
        # Create admin notification
        try:
            notification_title = f"Installment Payment - {instance.student_fee.student.user.username}" if instance.installment else f"Payment Received - {instance.student_fee.student.user.username}"
            notification_message = f"Student {instance.student_fee.student.user.username} (ID: {instance.student_fee.student.enrollment_id}) has paid ₹{instance.amount}"
            if instance.installment:
                notification_message += f" for Installment {instance.installment.sequence}"
            notification_message += f" on {instance.payment_date.strftime('%d/%m/%Y at %H:%M')}. Receipt: {instance.receipt_number}"
            
            AdminNotification.objects.create(
                title=notification_title,
                message=notification_message,
                notification_type='installment_payment' if instance.installment else 'payment',
                student=instance.student_fee.student,
                amount=instance.amount,
                installment_number=instance.installment.sequence if instance.installment else None
            )
        except Exception as e:
            pass
        
        # Create student notification
        try:
            StudentNotification.objects.create(
                student=instance.student_fee.student,
                title="Payment Successful",
                message=f"Your payment of ₹{instance.amount} has been processed successfully. Receipt: {instance.receipt_number}",
                notification_type='payment_success'
            )
        except Exception as e:
            pass