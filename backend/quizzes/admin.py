from django.contrib import admin
from .models import CourseQuiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer, QuizAchievement

class QuizOptionInline(admin.TabularInline):
    model = QuizOption
    extra = 4

class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 1

@admin.register(CourseQuiz)
class CourseQuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'language', 'total_questions', 'passing_score']
    list_filter = ['course', 'language']
    search_fields = ['title', 'course__title']
    inlines = [QuizQuestionInline]

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'question_text', 'question_type', 'order']
    list_filter = ['quiz', 'question_type']
    inlines = [QuizOptionInline]

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'total_questions', 'percentage', 'status', 'completed_at']
    list_filter = ['status', 'quiz', 'completed_at']
    search_fields = ['user__username', 'quiz__title']
    readonly_fields = ['percentage', 'badge_earned']

@admin.register(QuizAchievement)
class QuizAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'badge_type', 'earned_at']
    list_filter = ['badge_type', 'quiz', 'earned_at']
    search_fields = ['user__username', 'quiz__title']