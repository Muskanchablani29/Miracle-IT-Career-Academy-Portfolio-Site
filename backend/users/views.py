from rest_framework import generics, permissions, status, viewsets
from .models import CustomUser, Student, Faculty, Admin, Workshop, Certificate, WorkshopRegistration, Batch
from .serializers import (
    RegisterSerializer, UserSerializer, CreateAdminSerializer, 
    CreateFacultySerializer, CreateStudentSerializer, StudentSerializer,
    FacultySerializer, AdminSerializer, StudentLoginSerializer,
    WorkshopSerializer, CertificateSerializer, IntegratedDashboardSerializer,
    WorkshopRegistrationSerializer, BatchSerializer
)
from courses.models import Course, CourseSyllabus, SyllabusItem, Video, Quiz, CourseEnrollment, Notification
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import logging
from datetime import datetime, date

logger = logging.getLogger(__name__)

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsFaculty(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'faculty'

class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(created_by=self.request.user)
            logger.info(f"Batch created successfully by user {self.request.user.id}")
        except Exception as e:
            logger.error(f"Error creating batch by user {self.request.user.id}: {str(e)}")
            raise e

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Student.objects.all()
        batch_id = self.request.query_params.get('batch_id', None)
        if user.role == 'admin':
            if batch_id:
                queryset = queryset.filter(batch_id=batch_id)
        elif user.role == 'faculty':
            queryset = queryset.filter(created_by=user)
            if batch_id:
                queryset = queryset.filter(batch_id=batch_id)
        else:
            queryset = Student.objects.none()
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = CreateStudentSerializer(instance=instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class IntegratedDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            data = {}

            # Courses
            try:
                if user.role == 'faculty':
                    courses = Course.objects.filter(created_by=user)
                elif user.role == 'admin':
                    courses = Course.objects.all()
                else:
                    courses = Course.objects.none()
                data['courses'] = [{
                    'id': course.id,
                    'title': course.title,
                    'image': course.image.url if course.image and hasattr(course.image, 'url') else None,
                    'students_count': CourseEnrollment.objects.filter(course=course).count()
                } for course in courses]
            except Exception as e:
                logger.error(f"Error fetching courses: {str(e)}")
                data['courses'] = []

            # Students
            try:
                if user.role == 'faculty':
                    students = Student.objects.filter(created_by=user)
                elif user.role == 'admin':
                    students = Student.objects.all()
                else:
                    students = Student.objects.none()
                data['students'] = StudentSerializer(students, many=True).data
            except Exception as e:
                logger.error(f"Error fetching students: {str(e)}")
                data['students'] = []

            # Announcements
            try:
                if user.role in ['faculty', 'admin']:
                    announcements = Notification.objects.filter(user=user).order_by('-created_at')[:5]
                else:
                    announcements = Notification.objects.none()
                data['announcements'] = [{
                    'id': ann.id,
                    'title': ann.title,
                    'message': ann.message,
                    'created_at': ann.created_at
                } for ann in announcements]
            except Exception as e:
                logger.error(f"Error fetching announcements: {str(e)}")
                data['announcements'] = []

            # Upcoming Classes - Handle missing fields gracefully
            try:
                upcoming_classes = CourseEnrollment.objects.none()
                data['upcomingClasses'] = []
                
                # Check if CourseEnrollment has the required fields
                has_date_field = hasattr(CourseEnrollment, 'date')
                has_time_field = hasattr(CourseEnrollment, 'time')
                has_location_field = hasattr(CourseEnrollment, 'location')
                
                if has_date_field:
                    if user.role == 'faculty':
                        upcoming_classes = CourseEnrollment.objects.filter(
                            course__created_by=user, 
                            date__gte=datetime.now().date()
                        ).order_by('date')[:5]
                    elif user.role == 'admin':
                        upcoming_classes = CourseEnrollment.objects.filter(
                            date__gte=datetime.now().date()
                        ).order_by('date')[:5]
                
                data['upcomingClasses'] = []
                for cls in upcoming_classes:
                    class_data = {
                        'id': cls.id,
                        'course_title': cls.course.title if hasattr(cls, 'course') else "Unknown Course"
                    }
                    if has_date_field:
                        class_data['date'] = cls.date
                    if has_time_field:
                        class_data['time'] = cls.time
                    if has_location_field:
                        class_data['location'] = cls.location
                    
                    data['upcomingClasses'].append(class_data)
            except Exception as e:
                logger.error(f"Error fetching upcoming classes: {str(e)}")
                data['upcomingClasses'] = []

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Dashboard error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        logger.info(f"Login attempt for username: {username}")
        
        # Try to authenticate the user
        user = authenticate(username=username, password=password)
        if user is None:
            logger.error(f"Authentication failed for username: {username}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # If authentication succeeded, proceed with token generation
        response = super().post(request, *args, **kwargs)
        
        # Add user info to response
        if response.status_code == 200:
            response.data['user'] = UserSerializer(user).data
            
        return response

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class CreateAdminView(generics.CreateAPIView):
    serializer_class = CreateAdminSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class CreateFacultyView(generics.CreateAPIView):
    serializer_class = CreateFacultySerializer
    permission_classes = [IsAuthenticated, IsAdmin]

class CreateStudentView(generics.CreateAPIView):
    serializer_class = CreateStudentSerializer
    permission_classes = [IsAuthenticated]

class ListFacultyView(generics.ListAPIView):
    serializer_class = FacultySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Faculty.objects.all()
        return Faculty.objects.none()

class ListStudentView(generics.ListAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Student.objects.all()
        elif user.role == 'faculty':
            return Student.objects.filter(created_by=user)
        return Student.objects.none()

class StudentLoginView(APIView):
    def post(self, request):
        serializer = StudentLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        enrollment_id = serializer.validated_data['enrollment_id']
        password = serializer.validated_data['date_of_birth']
        
        try:
            student = Student.objects.get(enrollment_id=enrollment_id)
            user = student.user
            
            # Add debug logging
            logger.info(f"Login attempt for enrollment_id: {enrollment_id}")
            logger.info(f"Username being used for authentication: {user.username}")
            
            # For student login, the password is the date of birth in ddmmyyyy format
            # Check if the password is already in this format or needs conversion
            if len(password) == 8 and password.isdigit():
                # Password is already in ddmmyyyy format
                pass
            else:
                # Try to convert from date format to ddmmyyyy string
                try:
                    from datetime import datetime
                    dob_date = datetime.strptime(password, '%Y-%m-%d').date()
                    password = dob_date.strftime('%d%m%Y')
                    logger.info(f"Converted date to password format: {password}")
                except Exception as e:
                    logger.error(f"Error converting date: {str(e)}")
            
            user = authenticate(username=user.username, password=password)
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                })
            logger.error(f"Authentication failed for user: {student.user.username}")
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Student.DoesNotExist:
            logger.error(f"Student not found with enrollment_id: {enrollment_id}")
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

class WorkshopViewSet(viewsets.ModelViewSet):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer
    permission_classes = [IsAuthenticated]

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

class WorkshopRegistrationViewSet(viewsets.ModelViewSet):
    queryset = WorkshopRegistration.objects.all()
    serializer_class = WorkshopRegistrationSerializer
