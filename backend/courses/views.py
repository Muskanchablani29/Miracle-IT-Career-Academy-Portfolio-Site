from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Course, Video, Quiz, CourseSyllabus, SyllabusItem, CourseEnrollment, Notification
from .serializers import (
    CourseSerializer, CourseDetailSerializer, VideoSerializer, QuizSerializer,
    CourseSyllabusSerializer, SyllabusItemSerializer, CourseEnrollmentSerializer,
    NotificationSerializer
)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [permissions.AllowAny]  # Allow public access to courses
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer

class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access to videos
    
    def get_queryset(self):
        queryset = Video.objects.all()
        course_id = self.request.query_params.get('course_id', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access to quizzes

class CourseSyllabusViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSyllabusSerializer
    
    def get_queryset(self):
        queryset = CourseSyllabus.objects.all()
        course_id = self.request.query_params.get('course_id', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser() | 
                permissions.DjangoModelPermissions()]

class SyllabusItemViewSet(viewsets.ModelViewSet):
    serializer_class = SyllabusItemSerializer
    
    def get_queryset(self):
        queryset = SyllabusItem.objects.all()
        module_id = self.request.query_params.get('module_id', None)
        if module_id is not None:
            queryset = queryset.filter(module_id=module_id)
        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser() | 
                permissions.DjangoModelPermissions()]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_in_course(request):
    course_id = request.data.get('course_id')
    
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    enrollment, created = CourseEnrollment.objects.get_or_create(
        user=request.user,
        course=course
    )
    
    if created:
        return Response({'message': 'Successfully enrolled in course'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': 'Already enrolled in this course'}, status=status.HTTP_200_OK)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'}, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_enrollments(request):
    enrollments = CourseEnrollment.objects.filter(user=request.user)
    serializer = CourseEnrollmentSerializer(enrollments, many=True)
    return Response(serializer.data)