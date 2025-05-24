from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, VideoViewSet, QuizViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'quizzes', QuizViewSet)

urlpatterns = [
    path('', include(router.urls)),
]