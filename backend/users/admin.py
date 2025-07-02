from django.contrib import admin
from .models import (
    CustomUser, Student, Faculty, Admin, Workshop, Certificate, Batch, Attendance, Holiday, 
    Project, ProjectSubmission, FeeStructure, StudentFee, FeePayment, FeeInstallment,
    AdminNotification, StudentNotification
)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    search_fields = ('username', 'email')
    list_filter = ('role',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'enrollment_id', 'date_of_birth', 'admission_date', 'batch')
    search_fields = ('user__username', 'enrollment_id')
    list_filter = ('batch', 'admission_date')
    raw_id_fields = ('user',)
    fields = ('user', 'enrollment_id', 'date_of_birth', 'admission_date', 'batch', 'course')

@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('user', 'department')
    search_fields = ('user__username', 'department')

@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_super_admin')
    search_fields = ('user__username',)

@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'available_seats')
    search_fields = ('title', 'description')

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'duration')
    search_fields = ('title', 'description')

@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'is_present')
    search_fields = ('student__user__username', 'date')
    raw_id_fields = ('student',)
    list_filter = ('is_present', 'date')

@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ('date', 'name', 'is_government')
    search_fields = ('name', 'date')
    list_filter = ('is_government',)
    
# @admin.register(Project)
# class ProjectAdmin(admin.ModelAdmin):
#     list_display = ('title', 'description', 'student', 'faculty', 'status')
#     search_fields = ('title', 'description', 'student__user__username', 'faculty__user__username')
#     raw_id_fields = ('student', 'faculty')
#     list_filter = ('status',)

@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'total_amount', 'installments')
    search_fields = ('name', 'course__title')

@admin.register(StudentFee)
class StudentFeeAdmin(admin.ModelAdmin):
    list_display = ('student', 'fee_structure', 'total_amount', 'amount_paid', 'due_amount', 'status')
    list_filter = ('status', 'assigned_date')
    search_fields = ('student__user__username', 'student__enrollment_id')
    readonly_fields = ('due_amount',)
    
    def due_amount(self, obj):
        return obj.total_amount - obj.amount_paid
    due_amount.short_description = 'Due Amount'

@admin.register(FeePayment)
class FeePaymentAdmin(admin.ModelAdmin):
    list_display = ('receipt_number', 'get_student_name', 'amount', 'payment_mode', 'status', 'payment_date')
    list_filter = ('payment_mode', 'status', 'payment_date')
    search_fields = ('receipt_number', 'student_fee__student__user__username', 'transaction_id')
    readonly_fields = ('receipt_number', 'payment_date')
    
    def get_student_name(self, obj):
        return obj.student_fee.student.user.username
    get_student_name.short_description = 'Student Name'

@admin.register(FeeInstallment)
class FeeInstallmentAdmin(admin.ModelAdmin):
    list_display = ('fee_structure', 'sequence', 'amount', 'due_date')
    list_filter = ('due_date',)
    ordering = ('fee_structure', 'sequence')

@admin.register(AdminNotification)
class AdminNotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'student', 'amount', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('title', 'student__user__username')

@admin.register(StudentNotification)
class StudentNotificationAdmin(admin.ModelAdmin):
    list_display = ('student', 'title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('title', 'student__user__username')