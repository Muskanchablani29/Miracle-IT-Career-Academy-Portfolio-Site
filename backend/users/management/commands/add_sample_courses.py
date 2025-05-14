from django.core.management.base import BaseCommand
from users.models import Category, Course

class Command(BaseCommand):
    help = 'Add sample categories and courses data'

    def handle(self, *args, **kwargs):
        web_dev, created = Category.objects.get_or_create(name='Web Development', defaults={'description': 'Courses on web development technologies'})
        mobile_dev, created = Category.objects.get_or_create(name='Mobile Development', defaults={'description': 'Courses on mobile app development'})
        data_science, created = Category.objects.get_or_create(name='Data Science', defaults={'description': 'Courses on data science and machine learning'})

        Course.objects.get_or_create(
            title='Complete Web Development Bootcamp',
            defaults={
                'description': 'Learn full stack web development from scratch.',
                'category': web_dev,
                'language': 'English',
            }
        )
        Course.objects.get_or_create(
            title='React Native - Mobile App Development',
            defaults={
                'description': 'Build mobile apps using React Native.',
                'category': mobile_dev,
                'language': 'English',
            }
        )
        Course.objects.get_or_create(
            title='Python for Data Science and Machine Learning',
            defaults={
                'description': 'Learn Python for data science and ML.',
                'category': data_science,
                'language': 'English',
            }
        )
        self.stdout.write(self.style.SUCCESS('Sample categories and courses added successfully.'))
