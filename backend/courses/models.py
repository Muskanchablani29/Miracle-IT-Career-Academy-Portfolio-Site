from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField()
    duration = models.CharField(max_length=50)
    level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Video(models.Model):
    course = models.ForeignKey(Course, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    url = models.URLField()
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    class Meta:
        ordering = ['order']

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField(max_length=500)
    questions = models.IntegerField(default=0)
    time = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=50)
    
    def __str__(self):
        return self.title