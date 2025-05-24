from rest_framework import generics, permissions, status, viewsets
from .models import CustomUser, Student, Faculty, Admin, Workshop, Certificate
from .serializers import (
    RegisterSerializer, UserSerializer, CreateAdminSerializer, 
    CreateFacultySerializer, CreateStudentSerializer, StudentSerializer,
    FacultySerializer, AdminSerializer, StudentLoginSerializer,
    WorkshopSerializer, CertificateSerializer
)
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
    # Temporarily allow any authenticated user for debugging
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logger.debug(f"CreateStudentView - User: {request.user}, Role: {request.user.role}")
        logger.debug(f"Request data: {request.data}")
        
        # For debugging, temporarily bypass role check
        # if request.user.role != 'faculty':
        #     return Response(
        #         {"detail": "Only faculty users can create student accounts."},
        #         status=status.HTTP_403_FORBIDDEN
        #     )
        
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

class ListFacultyView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # Temporarily allow any authenticated user
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

class ListStudentView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = StudentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Student.objects.all()
        elif user.role == 'faculty':
            return Student.objects.filter(created_by=user)
        return Student.objects.none()

# New ViewSets for Workshop and Certificate
class WorkshopViewSet(viewsets.ModelViewSet):
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer