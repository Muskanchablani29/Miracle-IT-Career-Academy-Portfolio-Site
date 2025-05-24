from rest_framework import serializers
from .models import CustomUser, Student, Faculty, Admin, Workshop, Certificate
from django.contrib.auth.password_validation import validate_password
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = ['id', 'user', 'enrollment_id', 'date_of_birth']

class FacultySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Faculty
        fields = ['id', 'user', 'department']

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Admin
        fields = ['id', 'user', 'is_super_admin']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
        )
        role = validated_data['role']
        if role == 'student':
            Student.objects.create(user=user)
        elif role == 'faculty':
            Faculty.objects.create(user=user)
        elif role == 'admin':
            Admin.objects.create(user=user)
        return user

class CreateAdminSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    is_super_admin = serializers.BooleanField(default=False)

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='admin',
        )
        Admin.objects.create(
            user=user,
            is_super_admin=validated_data.get('is_super_admin', False)
        )
        return user

class CreateFacultySerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    department = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='faculty',
        )
        Faculty.objects.create(
            user=user,
            department=validated_data.get('department', ''),
            created_by=self.context['request'].user
        )
        return user

class CreateStudentSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    enrollment_id = serializers.CharField(required=True)
    date_of_birth = serializers.DateField(required=True)

    def create(self, validated_data):
        # Use date of birth as password in ddmmyyyy format
        dob = validated_data['date_of_birth']
        password = dob.strftime('%d%m%Y')
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            role='student',
        )
        Student.objects.create(
            user=user,
            enrollment_id=validated_data['enrollment_id'],
            date_of_birth=validated_data['date_of_birth'],
            created_by=self.context['request'].user
        )
        return user

class StudentLoginSerializer(serializers.Serializer):
    enrollment_id = serializers.CharField(required=True)
    date_of_birth = serializers.CharField(required=True)
    
    def validate_date_of_birth(self, value):
        # This field now accepts a string (password) instead of a date
        # We'll handle the conversion in the view
        return value

class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ['id', 'title', 'description', 'image', 'date', 'location', 'available_seats']

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ['id', 'title', 'description', 'image', 'duration', 'level']