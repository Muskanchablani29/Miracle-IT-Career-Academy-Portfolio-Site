from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
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

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        logger.info(f"Login attempt for username: {username}")
        
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                logger.info(f"Login successful for username: {username}")
                # Add role information to the response data
                user = authenticate(username=username, password=request.data.get('password', ''))
                if user is not None:
                    response.data['role'] = user.role
            else:
                logger.warning(f"Login failed for username: {username}, response: {response.data}")
            return response
        except Exception as e:
            logger.error(f"Login exception for username: {username}, error: {str(e)}")
            return Response(
                {"detail": "Invalid credentials. Please check your username and password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

class StudentLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        logger.debug(f"StudentLoginView - Request data: {request.data}")
        
        serializer = StudentLoginSerializer(data=request.data)
        if serializer.is_valid():
            enrollment_id = serializer.validated_data['enrollment_id']
            password = serializer.validated_data['date_of_birth']
            
            logger.debug(f"Looking for student with enrollment_id={enrollment_id}")
            
            try:
                # Find all students with this enrollment ID
                students = Student.objects.filter(enrollment_id=enrollment_id.strip())
                
                if not students.exists():
                    logger.error(f"No student found with enrollment_id={enrollment_id}")
                    return Response(
                        {"detail": "Invalid enrollment ID or password."},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                # Get the student
                student = students.first()
                user = student.user
                
                # Try to authenticate with username and password
                auth_user = authenticate(username=user.username, password=password)
                
                if auth_user is None:
                    # If direct authentication fails, try with DOB format
                    try:
                        # Try to parse the password as a date in DDMMYYYY format
                        day = int(password[:2])
                        month = int(password[2:4])
                        year = int(password[4:])
                        
                        # Create a date object
                        dob_date = date(year, month, day)
                        
                        # Check if this matches the student's DOB
                        if student.date_of_birth == dob_date:
                            # If it matches, generate token
                            refresh = RefreshToken.for_user(user)
                            
                            return Response({
                                'refresh': str(refresh),
                                'access': str(refresh.access_token),
                                'user': UserSerializer(user).data
                            })
                        else:
                            logger.error(f"DOB mismatch for student {student.id}")
                            return Response(
                                {"detail": "Invalid enrollment ID or password."},
                                status=status.HTTP_401_UNAUTHORIZED
                            )
                    except (ValueError, IndexError):
                        logger.error(f"Failed to parse password as date: {password}")
                        return Response(
                            {"detail": "Invalid enrollment ID or password."},
                            status=status.HTTP_401_UNAUTHORIZED
                        )
                else:
                    # Direct authentication succeeded
                    refresh = RefreshToken.for_user(auth_user)
                    
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': UserSerializer(auth_user).data
                    })
                
            except Exception as e:
                logger.error(f"Exception during student login: {str(e)}")
                return Response(
                    {"detail": "An error occurred during login."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            logger.error(f"Invalid serializer data: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            data = UserSerializer(user).data
            
            if user.role == 'student':
                student_data = StudentSerializer(user.student_profile).data
                data.update({'student_profile': student_data})
            elif user.role == 'faculty':
                faculty_data = FacultySerializer(user.faculty_profile).data
                data.update({'faculty_profile': faculty_data})
            elif user.role == 'admin':
                admin_data = AdminSerializer(user.admin_profile).data
                data.update({'admin_profile': admin_data})
                
            return Response(data)
        except Exception as e:
            logger.error(f"Profile view error: {str(e)}")
            return Response(
                {"detail": "Error retrieving profile data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CreateAdminView(APIView):
    permission_classes = [permissions.AllowAny]  # Initially allow anyone to create the first admin
    
    def post(self, request):
        # Check if any admin exists
        if Admin.objects.exists():
            return Response(
                {"detail": "Admin already exists. Only one admin can be created."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = CreateAdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Admin created successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateFacultyView(APIView):
    # Temporarily allow any authenticated user for debugging
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logger.debug(f"CreateFacultyView - User: {request.user}, Role: {request.user.role}")
        logger.debug(f"Request data: {request.data}")
        
        # For debugging, temporarily bypass role check
        # if request.user.role != 'admin':
        #     return Response(
        #         {"detail": "Only admin users can create faculty accounts."},
        #         status=status.HTTP_403_FORBIDDEN
        #     )
        
        serializer = CreateFacultySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                faculty = serializer.save()
                logger.debug(f"Faculty created successfully: {faculty}")
                return Response(
                    {"detail": "Faculty created successfully."},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                logger.error(f"Error creating faculty: {str(e)}")
                return Response(
                    {"detail": f"Error creating faculty: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            logger.error(f"Faculty serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateStudentView(APIView):
    # Temporarily allow any user for testing
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        logger.debug(f"CreateStudentView - User: {request.user if request.user.is_authenticated else 'Anonymous'}, Role: {getattr(request.user, 'role', 'N/A')}")
        logger.debug(f"Request data: {request.data}")

        serializer = CreateStudentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                student = serializer.save()
                logger.debug(f"Student created successfully: {student}")
                logger.debug(f"Student details - enrollment_id: {student.enrollment_id}, date_of_birth: {student.date_of_birth}")
                logger.debug(f"Password set as: {student.date_of_birth.strftime('%d%m%Y')}")
                return Response(
                    {"detail": "Student created successfully."},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                logger.error(f"Error creating student: {str(e)}")
                return Response(
                    {"detail": f"Error creating student: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            logger.error(f"Student serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Batch.objects.all()
        course_id = self.request.query_params.get('course', None)
        if course_id is not None:
            queryset = queryset.filter(course_id=course_id)
        return queryset
        
    def create(self, request, *args, **kwargs):
        try:
            # Extract data from request
            name = request.data.get('name')
            course_id = request.data.get('course_id')
            
            # Create batch directly using raw SQL
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO users_batch (name, course_id, created_at, updated_at) VALUES (%s, %s, NOW(), NOW())",
                    [name, course_id]
                )
                batch_id = cursor.lastrowid
                
            # Get the created batch
            batch = Batch.objects.get(id=batch_id)
            
            # Return serialized data
            serializer = self.get_serializer(batch)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            import traceback
            logger.error(f"Error in BatchViewSet.create: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        try:
            # Log the incoming data for debugging
            logger.info(f"Creating batch with data: {self.request.data}")
            
            # Save the batch
            batch = serializer.save()
            logger.info(f"Batch created successfully: {serializer.data}")
            return batch
        except Exception as e:
            logger.error(f"Error creating batch: {str(e)}")
            # Return a more specific error response
            from rest_framework.exceptions import APIException
            raise APIException(f"Failed to create batch: {str(e)}")

    @action(detail=True, methods=['post'])
    def assign_students(self, request, pk=None):
        batch = self.get_object()
        student_ids = request.data.get('student_ids', [])
        if not isinstance(student_ids, list):
            return Response({"error": "student_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)
        students = Student.objects.filter(id__in=student_ids)
        for student in students:
            student.batch = batch
            student.save()
        return Response({"message": f"Assigned {students.count()} students to batch {batch.name}"}, status=status.HTTP_200_OK)

class ListFacultyView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # Temporarily allow any authenticated user
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

class ListStudentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get batch_id from query parameters
            batch_id = request.query_params.get('batch_id', None)
            
            # Filter students by batch_id if provided
            if batch_id:
                students = Student.objects.filter(batch_id=batch_id)
            else:
                students = Student.objects.all()
                
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in ListStudentView.get: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return Response(
                {"detail": f"An error occurred while fetching students: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# New ViewSets for Workshop and Certificate
class WorkshopViewSet(viewsets.ModelViewSet):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access for GET

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Log the serializer errors for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Workshop creation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WorkshopRegistrationViewSet(viewsets.ModelViewSet):
    queryset = WorkshopRegistration.objects.all()
    serializer_class = WorkshopRegistrationSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        # Only admin and faculty can list all registrations
        if not request.user.is_authenticated or (request.user.role != 'admin' and request.user.role != 'faculty'):
            return Response(
                {"detail": "You do not have permission to view workshop registrations."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer

class IntegratedDashboardView(APIView):
    """
    Integrated API endpoint that provides all data needed for the frontend
    including user profile, courses, workshops, certificates, and notifications
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]  # Allow public access for GET
    
    def get(self, request):
        try:
            # For authenticated users, provide full dashboard
            if request.user.is_authenticated:
                user = request.user
                serializer = IntegratedDashboardSerializer(user)
                return Response(serializer.data)
            else:
                # For anonymous users, provide only public data
                # Create a minimal response with just public data
                courses = Course.objects.all()
                workshops = Workshop.objects.all()
                certificates = Certificate.objects.all()
                quizzes = Quiz.objects.all()
                
                from .serializers import CourseIntegratedSerializer, WorkshopSerializer, CertificateSerializer, QuizIntegratedSerializer
                
                return Response({
                    'courses': CourseIntegratedSerializer(courses, many=True).data,
                    'workshops': WorkshopSerializer(workshops, many=True).data,
                    'certificates': CertificateSerializer(certificates, many=True).data,
                    'quizzes': QuizIntegratedSerializer(quizzes, many=True).data
                })
        except Exception as e:
            logger.error(f"Integrated dashboard error: {str(e)}")
            return Response(
                {"detail": f"Error retrieving dashboard data: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def post(self, request):
        """
        Handle various actions through a single endpoint
        """
        # Require authentication for POST actions
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required for this action"},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        action = request.data.get('action')
        
        if action == 'enroll_course':
            return self._enroll_in_course(request)
        elif action == 'mark_notification_read':
            return self._mark_notification_read(request)
        else:
            return Response(
                {"detail": "Invalid action specified"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _enroll_in_course(self, request):
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
    
    def _mark_notification_read(self, request):
        notification_id = request.data.get('notification_id')
        
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marked as read'}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)