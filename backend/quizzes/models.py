from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course

User = get_user_model()

class CourseQuiz(models.Model):
    course = models.ForeignKey(Course, related_name='quizzes', on_delete=models.CASCADE)
    language = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    total_questions = models.IntegerField(default=20)
    time_limit = models.IntegerField(default=30)  # in minutes
    passing_score = models.IntegerField(default=16)  # out of 20
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.course.title} - {self.language} Quiz"
    
    class Meta:
        unique_together = ['course', 'language']

class QuizQuestion(models.Model):
    QUESTION_TYPES = [
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
    ]
    
    quiz = models.ForeignKey(CourseQuiz, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES, default='mcq')
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.quiz.title} - Q{self.order}"
    
    class Meta:
        ordering = ['order']

class QuizOption(models.Model):
    question = models.ForeignKey(QuizQuestion, related_name='options', on_delete=models.CASCADE)
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.question} - Option {self.order}"
    
    class Meta:
        ordering = ['order']

class QuizAttempt(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]
    
    user = models.ForeignKey(User, related_name='quiz_attempts', on_delete=models.CASCADE)
    quiz = models.ForeignKey(CourseQuiz, related_name='attempts', on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_taken = models.IntegerField(null=True, blank=True)  # in seconds
    
    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}/{self.total_questions}"
    
    @property
    def percentage(self):
        return (self.score / self.total_questions) * 100 if self.total_questions > 0 else 0
    
    @property
    def badge_earned(self):
        if self.score >= self.quiz.passing_score:
            return 'gold'
        return None

class QuizAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(QuizOption, on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.attempt} - Q{self.question.order}"
    
    class Meta:
        unique_together = ['attempt', 'question']

class QuizAchievement(models.Model):
    BADGE_TYPES = [
        ('gold', 'Gold Badge'),
        ('silver', 'Silver Badge'),
        ('bronze', 'Bronze Badge'),
    ]
    
    user = models.ForeignKey(User, related_name='quiz_achievements', on_delete=models.CASCADE)
    quiz = models.ForeignKey(CourseQuiz, related_name='achievements', on_delete=models.CASCADE)
    attempt = models.ForeignKey(QuizAttempt, related_name='achievement', on_delete=models.CASCADE)
    badge_type = models.CharField(max_length=10, choices=BADGE_TYPES)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.badge_type}"
    
    class Meta:
        unique_together = ['user', 'quiz']