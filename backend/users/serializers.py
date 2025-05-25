from rest_framework import serializers
from .models import CustomUser, Student, Faculty, Admin, Workshop, Certificate
from django.contrib.auth.password_validation import validate_password
from datetime import datetime
from courses.models import Course, CourseSyllabus, SyllabusItem, Video, Quiz, CourseEnrollment, Notification

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

# Serializers for integrated API
class SyllabusItemIntegratedSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyllabusItem
        fields = ['id', 'title', 'description', 'order']

class CourseSyllabusIntegratedSerializer(serializers.ModelSerializer):
    items = SyllabusItemIntegratedSerializer(many=True, read_only=True)
    
    class Meta:
        model = CourseSyllabus
        fields = ['id', 'title', 'order', 'items', 'last_updated']

class VideoIntegratedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'url', 'order']

class QuizIntegratedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'image', 'questions', 'time', 'difficulty']

class CourseIntegratedSerializer(serializers.ModelSerializer):
    syllabus_modules = CourseSyllabusIntegratedSerializer(many=True, read_only=True)
    videos = VideoIntegratedSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'image', 'duration', 'level', 
                 'created_at', 'internship_duration', 'is_certified', 'last_updated',
                 'syllabus_modules', 'videos']

class CourseEnrollmentIntegratedSerializer(serializers.ModelSerializer):
    course = CourseIntegratedSerializer(read_only=True)
    
    class Meta:
        model = CourseEnrollment
        fields = ['id', 'course', 'enrolled_date']

class NotificationIntegratedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'created_at', 'is_read']

class IntegratedDashboardSerializer(serializers.Serializer):
    """
    Integrated serializer that combines user profile, courses, workshops, certificates, and notifications
    """
    user = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()
    enrollments = serializers.SerializerMethodField()
    workshops = serializers.SerializerMethodField()
    certificates = serializers.SerializerMethodField()
    notifications = serializers.SerializerMethodField()
    quizzes = serializers.SerializerMethodField()
    
    def get_user(self, obj):
        user = obj
        data = UserSerializer(user).data
        
        if user.role == 'student':
            try:
                student_data = StudentSerializer(user.student_profile).data
                data.update({'student_profile': student_data})
            except:
                pass
        elif user.role == 'faculty':
            try:
                faculty_data = FacultySerializer(user.faculty_profile).data
                data.update({'faculty_profile': faculty_data})
            except:
                pass
        elif user.role == 'admin':
            try:
                admin_data = AdminSerializer(user.admin_profile).data
                data.update({'admin_profile': admin_data})
            except:
                pass
            
        return data
    
    def get_courses(self, obj):
        courses = Course.objects.all()
        return CourseIntegratedSerializer(courses, many=True).data
    
    def get_enrollments(self, obj):
        user = obj
        enrollments = CourseEnrollment.objects.filter(user=user)
        return CourseEnrollmentIntegratedSerializer(enrollments, many=True).data
    
    def get_workshops(self, obj):
        workshops = Workshop.objects.all()
        return WorkshopSerializer(workshops, many=True).data
    
    def get_certificates(self, obj):
        certificates = Certificate.objects.all()
        return CertificateSerializer(certificates, many=True).data
    
    def get_notifications(self, obj):
        user = obj
        notifications = Notification.objects.filter(user=user).order_by('-created_at')
        return NotificationIntegratedSerializer(notifications, many=True).data
    
    def get_quizzes(self, obj):
        quizzes = Quiz.objects.all()
        return QuizIntegratedSerializer(quizzes, many=True).data

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
    enrollment_id = serializers.CharField(required=False)
    date_of_birth = serializers.DateField(required=True)

    def create(self, validated_data):
        # Use date of birth as password in ddmmyyyy format
        dob = validated_data['date_of_birth']
        password = dob.strftime('%d%m%Y')

        # Generate enrollment ID if not provided
        if 'enrollment_id' not in validated_data or not validated_data['enrollment_id']:
            # Get the current year
            current_year = datetime.now().year
            prefix = f"ENRL{str(current_year)[-2:]}"

            # Fetch all existing enrollment IDs with the current prefix
            existing_ids = Student.objects.filter(enrollment_id__startswith=prefix).values_list('enrollment_id', flat=True)
            print(f"DEBUG: existing_ids = {list(existing_ids)}")  # Debug print

            if not existing_ids:
                # No existing enrollment IDs, start from 001
                next_id = 1
            else:
                # Extract numeric suffixes
                existing_numbers = set()
                for eid in existing_ids:
                    try:
                        num = int(eid.replace(prefix, ''))
                        existing_numbers.add(num)
                    except ValueError:
                        continue
                print(f"DEBUG: existing_numbers = {existing_numbers}")  # Debug print

                # Find the lowest missing number starting from 1
                next_id = 1
                while next_id in existing_numbers:
                    next_id += 1

            validated_data['enrollment_id'] = f"{prefix}{next_id:03d}"
            print(f"DEBUG: assigned enrollment_id = {validated_data['enrollment_id']}")  # Debug print

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            role='student',
        )
        student = Student.objects.create(
            user=user,
            enrollment_id=validated_data['enrollment_id'],
            date_of_birth=validated_data['date_of_birth'],
            created_by=self.context['request'].user
        )
        return student
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