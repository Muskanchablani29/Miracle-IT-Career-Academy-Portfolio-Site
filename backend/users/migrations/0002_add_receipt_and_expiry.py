# Generated migration for receipt file and notification expiry

from django.db import migrations, models
import django.utils.timezone
from datetime import timedelta

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),  # Replace with your latest migration
    ]

    operations = [
        migrations.AddField(
            model_name='feepayment',
            name='receipt_file',
            field=models.FileField(blank=True, null=True, upload_to='receipts/'),
        ),
        migrations.AddField(
            model_name='adminnotification',
            name='expires_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]