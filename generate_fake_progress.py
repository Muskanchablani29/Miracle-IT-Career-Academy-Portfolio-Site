import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from users.models import Student
from courses.models import Course, Video

# Fake Progress Data Generator
def generate_fake_progress():
    """Generate fake progress data for all students"""
    
    fake_progress_data = []
    
    # Get all students and courses
    students = Student.objects.all()
    courses = Course.objects.all()
    
    for student in students:
        # Each student has progress in their enrolled course
        if hasattr(student, 'course') and student.course:
            course = student.course
            videos = Video.objects.filter(course=course)
            
            if videos.exists():
                total_videos = videos.count()
                
                # Generate random completion between 20-95%
                completion_percentage = random.randint(20, 95)
                videos_completed = int((completion_percentage / 100) * total_videos)
                
                # Create course progress
                course_progress = {
                    'student_id': student.id,
                    'student_name': f"{student.user.first_name} {student.user.last_name}",
                    'course_id': course.id,
                    'course_title': course.title,
                    'completion_percentage': completion_percentage,
                    'videos_completed': videos_completed,
                    'total_videos': total_videos,
                    'status': 'Completed' if completion_percentage >= 100 else 
                             'In Progress' if completion_percentage > 0 else 'Not Started',
                    'last_activity': (datetime.now() - timedelta(days=random.randint(0, 7))).isoformat()
                }
                
                fake_progress_data.append(course_progress)
                
                # Generate individual video progress
                for i, video in enumerate(videos[:videos_completed + 2]):  # Include some partial videos
                    if i < videos_completed:
                        # Completed videos
                        video_progress = random.randint(90, 100)
                    else:
                        # Partially watched videos
                        video_progress = random.randint(10, 89)
                    
                    fake_progress_data.append({
                        'type': 'video',
                        'student_id': student.id,
                        'video_id': video.id,
                        'video_title': video.title,
                        'watched_percentage': video_progress,
                        'completed': video_progress >= 90,
                        'last_watched_at': (datetime.now() - timedelta(hours=random.randint(1, 48))).isoformat()
                    })
    
    return fake_progress_data

# Sample data for immediate use
FAKE_PROGRESS_DATA = [
    {
        'student_id': 1,
        'student_name': 'John Doe',
        'course_id': 1,
        'course_title': 'Full Stack Web Development',
        'completion_percentage': 75.5,
        'videos_completed': 15,
        'total_videos': 20,
        'status': 'In Progress',
        'last_activity': '2024-12-19T10:30:00Z'
    },
    {
        'student_id': 2,
        'student_name': 'Jane Smith',
        'course_id': 1,
        'course_title': 'Full Stack Web Development',
        'completion_percentage': 45.0,
        'videos_completed': 9,
        'total_videos': 20,
        'status': 'In Progress',
        'last_activity': '2024-12-18T14:20:00Z'
    },
    {
        'student_id': 3,
        'student_name': 'Mike Johnson',
        'course_id': 2,
        'course_title': 'Python Programming',
        'completion_percentage': 90.0,
        'videos_completed': 18,
        'total_videos': 20,
        'status': 'In Progress',
        'last_activity': '2024-12-19T09:15:00Z'
    },
    {
        'student_id': 4,
        'student_name': 'Sarah Wilson',
        'course_id': 2,
        'course_title': 'Python Programming',
        'completion_percentage': 100.0,
        'videos_completed': 20,
        'total_videos': 20,
        'status': 'Completed',
        'last_activity': '2024-12-17T16:45:00Z'
    },
    {
        'student_id': 5,
        'student_name': 'David Brown',
        'course_id': 3,
        'course_title': 'Data Science & Analytics',
        'completion_percentage': 35.5,
        'videos_completed': 7,
        'total_videos': 20,
        'status': 'In Progress',
        'last_activity': '2024-12-19T11:00:00Z'
    },
    {
        'student_id': 6,
        'student_name': 'Emily Davis',
        'course_id': 1,
        'course_title': 'Full Stack Web Development',
        'completion_percentage': 62.5,
        'videos_completed': 12,
        'total_videos': 20,
        'status': 'In Progress',
        'last_activity': '2024-12-18T13:30:00Z'
    },
    {
        'student_id': 7,
        'student_name': 'Alex Miller',
        'course_id': 3,
        'course_title': 'Data Science & Analytics',
        'completion_percentage': 80.0,
        'videos_completed': 16,
        'total_videos': 20,
        'status': 'In Progress',
        'last_activity': '2024-12-19T08:45:00Z'
    },
    {
        'student_id': 8,
        'student_name': 'Lisa Garcia',
        'course_id': 2,
        'course_title': 'Python Programming',
        'completion_percentage': 55.0,
        'videos_completed': 11,
        'total_videos': 20,
        'status': 'In Progress',
        'last_activity': '2024-12-18T15:20:00Z'
    }
]

# Analytics data
FAKE_ANALYTICS = {
    'total_students': 8,
    'completed_students': 1,
    'in_progress_students': 7,
    'not_started_students': 0,
    'average_completion': 65.9
}

print("Fake progress data generated successfully!")
print(f"Total students: {len(FAKE_PROGRESS_DATA)}")
print(f"Average completion: {FAKE_ANALYTICS['average_completion']}%")