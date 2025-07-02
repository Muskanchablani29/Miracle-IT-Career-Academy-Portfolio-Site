from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import AdminNotification

class Command(BaseCommand):
    help = 'Clean up expired notifications'

    def handle(self, *args, **options):
        # Delete expired notifications
        expired_count = AdminNotification.objects.filter(
            expires_at__lt=timezone.now()
        ).count()
        
        AdminNotification.objects.filter(
            expires_at__lt=timezone.now()
        ).delete()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {expired_count} expired notifications')
        )