from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'videos', views.VideoViewSet, basename='video')
router.register(r'quizzes', views.QuizViewSet, basename='quiz')
router.register(r'syllabus', views.CourseSyllabusViewSet, basename='syllabus')
router.register(r'syllabus-items', views.SyllabusItemViewSet, basename='syllabus-item')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('enroll/', views.enroll_in_course, name='enroll-course'),
    path('enrollments/', views.get_user_enrollments, name='user-enrollments'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark-notification-read'),
]