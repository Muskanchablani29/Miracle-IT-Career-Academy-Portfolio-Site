from rest_framework import serializers
from .models import Course, Video, Quiz

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'url', 'order']

class CourseSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'image', 'duration', 'level', 'created_at', 'videos']

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'image', 'questions', 'time', 'difficulty']