from django.contrib import admin
from .models import CustomUser, Student, Faculty, Admin, Workshop, Certificate

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role')
    search_fields = ('username', 'email')
    list_filter = ('role',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'enrollment_id', 'date_of_birth')
    search_fields = ('user__username', 'enrollment_id')

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