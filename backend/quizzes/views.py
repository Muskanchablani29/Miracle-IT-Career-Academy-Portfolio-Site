from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from courses.models import Course, CourseEnrollment
from .models import CourseQuiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer, QuizAchievement
from .serializers import (CourseQuizSerializer, QuizQuestionSerializer, 
                         QuizAttemptSerializer, QuizAchievementSerializer)

@api_view(['GET'])
@permission_classes([])
def get_courses_with_quizzes(request):
    """Get all courses that have quizzes"""
    courses = Course.objects.filter(quizzes__isnull=False).distinct()
    course_data = []
    
    for course in courses:
        languages = course.quizzes.values_list('language', flat=True).distinct()
        image_url = None
        if course.image:
            try:
                image_url = request.build_absolute_uri(course.image.url)
            except:
                image_url = None
        
        course_data.append({
            'id': course.id,
            'title': course.title,
            'image': image_url,
            'languages': list(languages)
        })
    
    return Response(course_data)

@api_view(['GET'])
@permission_classes([])
def get_course_quizzes(request, course_id):
    """Get quizzes for a specific course"""
    course = get_object_or_404(Course, id=course_id)
    quizzes = CourseQuiz.objects.filter(course=course)
    serializer = CourseQuizSerializer(quizzes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([])
def get_quiz_by_course_language(request, course_id, language):
    """Get quiz for specific course and language"""
    quiz = get_object_or_404(CourseQuiz, course_id=course_id, language=language)
    serializer = CourseQuizSerializer(quiz)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([])
def start_quiz(request, quiz_id):
    """Start a new quiz attempt"""
    quiz = get_object_or_404(CourseQuiz, id=quiz_id)
    
    # Create demo attempt for anonymous users
    attempt_id = f"demo_{quiz_id}_{int(timezone.now().timestamp())}"
    
    # Get quiz questions
    questions = QuizQuestion.objects.filter(quiz=quiz).prefetch_related('options').order_by('order')
    
    if not questions.exists():
        return Response({'error': 'No questions available for this quiz'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    questions_data = QuizQuestionSerializer(questions, many=True).data
    
    return Response({
        'attempt_id': attempt_id,
        'quiz': CourseQuizSerializer(quiz).data,
        'questions': questions_data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request, attempt_id):
    """Submit quiz answers and calculate score"""
    attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
    
    if attempt.status == 'completed':
        return Response({'error': 'Quiz already completed'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    answers_data = request.data.get('answers', [])
    score = 0
    
    for answer_data in answers_data:
        question_id = answer_data.get('question_id')
        selected_option_id = answer_data.get('selected_option_id')
        
        question = get_object_or_404(QuizQuestion, id=question_id)
        selected_option = get_object_or_404(QuizOption, id=selected_option_id) if selected_option_id else None
        
        is_correct = selected_option and selected_option.is_correct
        if is_correct:
            score += 1
        
        QuizAnswer.objects.create(
            attempt=attempt,
            question=question,
            selected_option=selected_option,
            is_correct=is_correct
        )
    
    # Update attempt
    attempt.score = score
    attempt.status = 'completed'
    attempt.completed_at = timezone.now()
    attempt.time_taken = request.data.get('time_taken', 0)
    attempt.save()
    
    # Check for achievement
    if score >= attempt.quiz.passing_score:
        QuizAchievement.objects.get_or_create(
            user=request.user,
            quiz=attempt.quiz,
            attempt=attempt,
            defaults={'badge_type': 'gold'}
        )
    
    return Response({
        'score': score,
        'total_questions': attempt.total_questions,
        'percentage': attempt.percentage,
        'badge_earned': attempt.badge_earned,
        'passed': score >= attempt.quiz.passing_score
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_quiz_attempts(request):
    """Get all quiz attempts for the current user"""
    attempts = QuizAttempt.objects.filter(user=request.user, status='completed')
    serializer = QuizAttemptSerializer(attempts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_quiz_achievements(request):
    """Get all quiz achievements for the current user"""
    achievements = QuizAchievement.objects.filter(user=request.user)
    serializer = QuizAchievementSerializer(achievements, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_enrolled_course_quizzes(request):
    """Get quizzes for courses the user is enrolled in"""
    enrolled_courses = CourseEnrollment.objects.filter(user=request.user).values_list('course', flat=True)
    quizzes = CourseQuiz.objects.filter(course__in=enrolled_courses)
    
    quiz_data = []
    for quiz in quizzes:
        # Check if user has completed this quiz
        completed_attempt = QuizAttempt.objects.filter(
            user=request.user, quiz=quiz, status='completed'
        ).first()
        
        quiz_info = CourseQuizSerializer(quiz).data
        quiz_info['completed'] = completed_attempt is not None
        if completed_attempt:
            quiz_info['score'] = completed_attempt.score
            quiz_info['percentage'] = completed_attempt.percentage
            quiz_info['badge_earned'] = completed_attempt.badge_earned
        
        quiz_data.append(quiz_info)
    
    return Response(quiz_data)