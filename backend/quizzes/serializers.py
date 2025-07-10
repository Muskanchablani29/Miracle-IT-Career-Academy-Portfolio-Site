from rest_framework import serializers
from .models import CourseQuiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer, QuizAchievement

class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'option_text', 'order']

class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'question_type', 'order', 'options']

class CourseQuizSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = CourseQuiz
        fields = ['id', 'course', 'course_title', 'language', 'title', 'description', 
                 'total_questions', 'time_limit', 'passing_score']

class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    course_title = serializers.CharField(source='quiz.course.title', read_only=True)
    language = serializers.CharField(source='quiz.language', read_only=True)
    percentage = serializers.ReadOnlyField()
    badge_earned = serializers.ReadOnlyField()
    
    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'quiz_title', 'course_title', 'language', 'score', 
                 'total_questions', 'percentage', 'badge_earned', 'status', 
                 'started_at', 'completed_at', 'time_taken']

class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ['question', 'selected_option', 'is_correct']

class QuizAchievementSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    course_title = serializers.CharField(source='quiz.course.title', read_only=True)
    language = serializers.CharField(source='quiz.language', read_only=True)
    score = serializers.IntegerField(source='attempt.score', read_only=True)
    total_questions = serializers.IntegerField(source='attempt.total_questions', read_only=True)
    
    class Meta:
        model = QuizAchievement
        fields = ['id', 'quiz_title', 'course_title', 'language', 'badge_type', 
                 'score', 'total_questions', 'earned_at']