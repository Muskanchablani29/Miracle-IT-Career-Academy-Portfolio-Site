from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet)
router.register(r'videos', views.VideoViewSet, basename='video')
router.register(r'quizzes', views.QuizViewSet)
router.register(r'syllabus', views.CourseSyllabusViewSet, basename='syllabus')
router.register(r'syllabus-items', views.SyllabusItemViewSet, basename='syllabus-item')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'enquiries', views.CourseEnquiryViewSet, basename='enquiry')

urlpatterns = [
    path('', include(router.urls)),
    path('enroll/', views.enroll_in_course, name='enroll-in-course'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark-notification-read'),
    path('user-enrollments/', views.get_user_enrollments, name='user-enrollments'),
    path('latest-courses/', views.get_latest_courses, name='latest-courses'),
    path('course/<int:course_id>/', views.get_course_by_id, name='course-detail'),
    path('create-course/', views.create_course, name='create-course'),
    path('submit-enquiry/', views.submit_course_enquiry, name='submit-enquiry'),
    path('check-enrollment/<int:course_id>/', views.check_enrollment_status, name='check-enrollment'),
    
    # Payment gateway endpoints
    path('create-payment-order/', views.create_payment_order, name='create-payment-order'),
    path('verify-payment/', views.verify_payment, name='verify-payment'),
    
    # YouTube API endpoints
    path('youtube/playlist/<str:playlist_id>/', views.get_youtube_playlist_videos, name='youtube-playlist'),
    path('youtube/import-playlist/', views.import_youtube_playlist, name='import-youtube-playlist'),
]