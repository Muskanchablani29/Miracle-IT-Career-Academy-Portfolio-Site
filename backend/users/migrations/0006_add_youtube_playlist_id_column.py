from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_course_youtube_playlist_id'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE users_course ADD COLUMN youtube_playlist_id VARCHAR(100) NULL;",
            reverse_sql="ALTER TABLE users_course DROP COLUMN youtube_playlist_id;",
        ),
    ]
