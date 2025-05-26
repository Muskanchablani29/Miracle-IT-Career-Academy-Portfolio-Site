from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Course, Video, Quiz, CourseSyllabus, SyllabusItem, CourseEnrollment, Notification
from django.db.models import Q
from .serializers import (
    CourseSerializer, CourseDetailSerializer, VideoSerializer, QuizSerializer,
    CourseSyllabusSerializer, SyllabusItemSerializer, CourseEnrollmentSerializer,
    NotificationSerializer
)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
        
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        # Only admin and faculty can create/update courses
        return [permissions.IsAuthenticated()]
        
    def perform_create(self, serializer):
        # Check if user is admin or faculty
        user = self.request.user
        if user.is_staff or user.groups.filter(name='faculty').exists():
            serializer.save()
        else:
            raise permissions.PermissionDenied("Only admin and faculty can create courses.")

class VideoViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    
    def get_queryset(self):
        queryset = Video.objects.all()
        course_id = self.request.query_params.get('course_id', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset
        
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        # Only admin and faculty can create/update videos
        return [permissions.IsAuthenticated()]
        
    def perform_create(self, serializer):
        # Check if user is admin or faculty
        user = self.request.user
        if user.is_staff or user.groups.filter(name='faculty').exists():
            serializer.save()
        else:
            raise permissions.PermissionDenied("Only admin and faculty can add videos.")

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        # Only admin and faculty can create/update quizzes
        return [permissions.IsAuthenticated()]
        
    def perform_create(self, serializer):
        # Check if user is admin or faculty
        user = self.request.user
        if user.is_staff or user.groups.filter(name='faculty').exists():
            serializer.save()
        else:
            raise permissions.PermissionDenied("Only admin and faculty can create quizzes.")

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
        # Allow both admin and faculty to create/update syllabus
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        # Check if user is admin or faculty
        user = self.request.user
        if user.is_staff or user.groups.filter(name='faculty').exists():
            serializer.save()
        else:
            raise permissions.PermissionDenied("Only admin and faculty can create course syllabus.")

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
        # Allow both admin and faculty to create/update syllabus items
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        # Check if user is admin or faculty
        user = self.request.user
        if user.is_staff or user.groups.filter(name='faculty').exists():
            serializer.save()
        else:
            raise permissions.PermissionDenied("Only admin and faculty can create syllabus items.")

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
        
    @action(detail=False, methods=['get'])
    def course_updates(self, request):
        """Get notifications related to course updates"""
        notifications = Notification.objects.filter(
            user=request.user
        ).filter(
            Q(title__contains='Course') | Q(title__contains='Module') | Q(title__contains='Content')
        ).order_by('-created_at')
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

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

@api_view(['GET'])
def get_latest_courses(request):
    """Get the latest courses added or updated"""
    courses = Course.objects.all().order_by('-created_at')[:5]
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_course(request):
    """Create a new course"""
    # Check if user is admin or faculty
    user = request.user
    if not (user.is_staff or user.groups.filter(name='faculty').exists()):
        return Response(
            {'error': 'Only admin and faculty can create courses'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)