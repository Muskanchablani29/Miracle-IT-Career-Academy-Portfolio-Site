from rest_framework import serializers
from .models import Course, Video, Quiz, CourseSyllabus, SyllabusItem, CourseEnrollment, Notification, CourseEnquiry, Payment, Announcement

class SyllabusItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyllabusItem
        fields = ['id', 'title', 'description', 'order', 'module']

class CourseSyllabusSerializer(serializers.ModelSerializer):
    items = SyllabusItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = CourseSyllabus
        fields = ['id', 'title', 'order', 'course', 'items', 'last_updated']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'url', 'order', 'preview_duration']

class CourseSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    students_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'image', 'duration', 'level', 
                 'created_at', 'internship_duration', 'is_certified', 'last_updated',
                 'price', 'discount_price', 'students_count']
                 
    def get_students_count(self, obj):
        # Count students directly from Student model
        from users.models import Student
        return Student.objects.filter(course=obj).count()

class CourseDetailSerializer(serializers.ModelSerializer):
    syllabus_modules = CourseSyllabusSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)
    students_count = serializers.SerializerMethodField()
    preview_video = serializers.SerializerMethodField()
    fee_structure = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'image', 'duration', 'level', 
                 'created_at', 'internship_duration', 'is_certified', 'last_updated',
                 'syllabus_modules', 'videos', 'price', 'discount_price', 'students_count',
                 'preview_video_url', 'preview_duration', 'preview_video', 'fee_structure']
                 
    def get_students_count(self, obj):
        # Count students directly from Student model
        from users.models import Student
        return Student.objects.filter(course=obj).count()
    
    def get_preview_video(self, obj):
        return obj.get_first_video_as_preview()
    
    def get_fee_structure(self, obj):
        from users.models import FeeStructure
        fee_structure = FeeStructure.objects.filter(course=obj).first()
        if fee_structure:
            return {
                'id': fee_structure.id,
                'name': fee_structure.name,
                'total_amount': fee_structure.total_amount,
                'registration_fee': fee_structure.registration_fee,
                'tuition_fee': fee_structure.tuition_fee,
                'installments': fee_structure.installments
            }
        return None

class QuizSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'image', 'questions', 'time', 'difficulty']

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_title = serializers.ReadOnlyField(source='course.title')
    
    class Meta:
        model = CourseEnrollment
        fields = ['id', 'course', 'course_title', 'enrolled_date']
        read_only_fields = ['enrolled_date']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'created_at', 'is_read']
        read_only_fields = ['created_at']

class CourseEnquirySerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')
    
    class Meta:
        model = CourseEnquiry
        fields = ['id', 'name', 'email', 'phone', 'course', 'course_title', 'message', 'status', 'created_at']
        read_only_fields = ['created_at']

class PaymentSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')
    user_email = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = Payment
        fields = ['id', 'user', 'user_email', 'course', 'course_title', 'amount', 
                 'payment_id', 'order_id', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class AnnouncementSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')
    created_by_name = serializers.ReadOnlyField(source='created_by.username')
    attachment_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'message', 'course', 'course_title', 'priority', 
                 'attachment', 'attachment_url', 'created_by', 'created_by_name', 
                 'created_at', 'is_active']
        read_only_fields = ['created_at', 'created_by']
    
    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
        return None