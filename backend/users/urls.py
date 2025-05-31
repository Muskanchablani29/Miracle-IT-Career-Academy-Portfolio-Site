from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, CustomTokenObtainPairView, ProfileView, CreateAdminView,
    CreateFacultyView, CreateStudentView, ListFacultyView, ListStudentView,
    WorkshopViewSet, CertificateViewSet, IntegratedDashboardView, StudentLoginView,
    WorkshopRegistrationViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, CustomTokenObtainPairView, ProfileView, CreateAdminView,
    CreateFacultyView, CreateStudentView, ListFacultyView, ListStudentView,
    WorkshopViewSet, CertificateViewSet, IntegratedDashboardView, StudentLoginView,
    WorkshopRegistrationViewSet, BatchViewSet, StudentViewSet
)
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'workshops', WorkshopViewSet)
router.register(r'certificates', CertificateViewSet)
router.register(r'workshop-registrations', WorkshopRegistrationViewSet)
router.register(r'batches', BatchViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('create-admin/', CreateAdminView.as_view(), name='create_admin'),
    path('create-faculty/', CreateFacultyView.as_view(), name='create_faculty'),
    path('create-student/', CreateStudentView.as_view(), name='create_student'),
    path('faculty/', ListFacultyView.as_view(), name='list_faculty'),
    path('students/', ListStudentView.as_view(), name='list_students'),
    path('dashboard/', IntegratedDashboardView.as_view(), name='dashboard'),
    path('student-login/', StudentLoginView.as_view(), name='student_login'),
]