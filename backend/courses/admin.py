from django.contrib import admin
from .models import Course, Video, Quiz

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'duration', 'created_at')
    search_fields = ('title', 'description')

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    search_fields = ('title',)

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'questions', 'time', 'difficulty')
    search_fields = ('title', 'description')