from django.core.management.base import BaseCommand
from users.models import Student, Attendance
from django.db.models import Count, Q
import random
from datetime import date, timedelta


class Command(BaseCommand):
    help = 'Boost attendance for students with >75% to 85-95% range'

    def handle(self, *args, **kwargs):
        students = Student.objects.all()
        count = 0
        
        for student in students:
            total = student.attendances.count()
            if total == 0:
                continue
            
            present = student.attendances.filter(is_present=True).count()
            percentage = (present / total) * 100
            
            if 75 < percentage < 85:
                # Add extra attendance records to boost to 85-95%
                target = random.randint(85, 95)
                needed_present = int((target * total / 100) - present)
                
                for i in range(needed_present):
                    Attendance.objects.get_or_create(
                        student=student,
                        date=date.today() - timedelta(days=i+1),
                        defaults={'is_present': True}
                    )
                
                new_total = student.attendances.count()
                new_present = student.attendances.filter(is_present=True).count()
                new_percentage = (new_present / new_total) * 100
                
                self.stdout.write(f'{student.user.username}: {percentage:.1f}% -> {new_percentage:.1f}%')
                count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Boosted {count} students attendance'))
