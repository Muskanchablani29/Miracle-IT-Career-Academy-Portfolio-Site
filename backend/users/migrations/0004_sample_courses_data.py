from django.db import migrations

def create_sample_data(apps, schema_editor):
    Category = apps.get_model('users', 'Category')
    Course = apps.get_model('users', 'Course')

    web_dev = Category.objects.create(name='Web Development', description='Courses on web development technologies')
    mobile_dev = Category.objects.create(name='Mobile Development', description='Courses on mobile app development')
    data_science = Category.objects.create(name='Data Science', description='Courses on data science and machine learning')

    Course.objects.create(
        title='Complete Web Development Bootcamp',
        description='Learn full stack web development from scratch.',
        category=web_dev,
        language='English',
    )
    Course.objects.create(
        title='React Native - Mobile App Development',
        description='Build mobile apps using React Native.',
        category=mobile_dev,
        language='English',
    )
    Course.objects.create(
        title='Python for Data Science and Machine Learning',
        description='Learn Python for data science and ML.',
        category=data_science,
        language='English',
    )

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_category_course'),
    ]

    operations = [
        migrations.RunPython(create_sample_data),
    ]
