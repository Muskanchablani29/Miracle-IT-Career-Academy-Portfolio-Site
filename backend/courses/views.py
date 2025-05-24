from rest_framework import viewsets
from .models import Course, Video, Quiz
from .serializers import CourseSerializer, VideoSerializer, QuizSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    
    def get_queryset(self):
        queryset = Video.objects.all()
        course_id = self.request.query_params.get('course_id', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer