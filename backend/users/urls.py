from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, CustomTokenObtainPairView, StudentLoginView, ProfileView,
    CreateAdminView, CreateFacultyView, CreateStudentView, ListFacultyView,
    ListStudentView, BatchViewSet, WorkshopViewSet, StudentViewSet,
    WorkshopRegistrationViewSet, CertificateViewSet, IntegratedDashboardView
)

router = DefaultRouter()
router.register(r'batches', BatchViewSet, basename='batch')
router.register(r'workshops', WorkshopViewSet, basename='workshop')
router.register(r'workshop-registrations', WorkshopRegistrationViewSet, basename='workshop-registration')
router.register(r'certificates', CertificateViewSet, basename='certificate')
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('student-login/', StudentLoginView.as_view(), name='student_login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('create-admin/', CreateAdminView.as_view(), name='create_admin'),
    path('create-faculty/', CreateFacultyView.as_view(), name='create_faculty'),
    path('create-student/', CreateStudentView.as_view(), name='create_student'),
    path('faculty/', ListFacultyView.as_view(), name='list_faculty'),
    path('students/', ListStudentView.as_view(), name='list_students'),
    path('dashboard/', IntegratedDashboardView.as_view(), name='dashboard'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Other URLs
    
    # Add the new endpoint for assigning students to batches
    path('batches/<int:pk>/assign-students/', BatchViewSet.as_view({'post': 'assign_students'}), name='assign_students_to_batch'),
]