from django.urls import path, include
from .views import (
    RegisterView, ProfileView, CustomTokenObtainPairView,
    CreateAdminView, CreateFacultyView, CreateStudentView,
    ListFacultyView, ListStudentView, StudentLoginView,
    WorkshopViewSet, CertificateViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView
from django.http import HttpResponse
from rest_framework.routers import DefaultRouter

def api_root(request):
    return HttpResponse("Users API root. Available endpoints: register/, login/, token/refresh/, profile/")

router = DefaultRouter()
router.register(r'workshops', WorkshopViewSet)
router.register(r'certificates', CertificateViewSet)

urlpatterns = [
    path('', api_root, name='api_root'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('student-login/', StudentLoginView.as_view(), name='student_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    
    # Role-based user creation endpoints
    path('create-admin/', CreateAdminView.as_view(), name='create_admin'),
    path('create-faculty/', CreateFacultyView.as_view(), name='create_faculty'),
    path('create-student/', CreateStudentView.as_view(), name='create_student'),
    
    # List users by role
    path('faculty/', ListFacultyView.as_view(), name='list_faculty'),
    path('students/', ListStudentView.as_view(), name='list_students'),
    
    path('', include(router.urls)),
]