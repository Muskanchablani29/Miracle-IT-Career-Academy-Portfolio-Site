from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

class Student(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='student_profile')
    enrollment_id = models.CharField(max_length=50, unique=True)
    date_of_birth = models.DateField()
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='created_students')

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
    image = models.URLField(max_length=500)
    date = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    available_seats = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title

class Certificate(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField()
    duration = models.CharField(max_length=50)
    level = models.CharField(max_length=50)
    
    def __str__(self):
        return self.title