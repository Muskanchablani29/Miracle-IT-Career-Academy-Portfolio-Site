from rest_framework import serializers
from .models import Course, Video, Quiz, CourseSyllabus, SyllabusItem, CourseEnrollment, Notification

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
        fields = ['id', 'title', 'url', 'order']

class CourseSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'image', 'duration', 'level', 
                 'created_at', 'internship_duration', 'is_certified', 'last_updated']

class CourseDetailSerializer(serializers.ModelSerializer):
    syllabus_modules = CourseSyllabusSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'image', 'duration', 'level', 
                 'created_at', 'internship_duration', 'is_certified', 'last_updated',
                 'syllabus_modules', 'videos']

class QuizSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'image', 'questions', 'time', 'difficulty']

class CourseEnrollmentSerializer(serializers.ModelSerializer):
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