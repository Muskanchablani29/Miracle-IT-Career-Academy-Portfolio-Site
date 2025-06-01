from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import date

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