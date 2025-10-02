from django.urls import path
from . import views

urlpatterns = [
    path('courses-with-quizzes/', views.get_courses_with_quizzes, name='courses_with_quizzes'),
    path('course/<int:course_id>/quizzes/', views.get_course_quizzes, name='course_quizzes'),
    path('course/<int:course_id>/language/<str:language>/', views.get_quiz_by_course_language, name='quiz_by_course_language'),
    path('start/<int:quiz_id>/', views.start_quiz, name='start_quiz'),
    path('submit/<str:attempt_id>/', views.submit_quiz, name='submit_quiz'),
    path('my-attempts/', views.get_user_quiz_attempts, name='user_quiz_attempts'),
    path('my-achievements/', views.get_user_quiz_achievements, name='user_quiz_achievements'),
    path('enrolled-quizzes/', views.get_enrolled_course_quizzes, name='enrolled_course_quizzes'),
]