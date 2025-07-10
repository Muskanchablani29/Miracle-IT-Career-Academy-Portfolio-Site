from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from django.db.models import Q
from datetime import datetime, date
from .models import Student, ProjectSubmission, Attendance, StudentAchievement
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_performance_analytics(request):
    """Comprehensive performance analytics for students"""
    if request.user.role != 'student':
        return Response(
            {"detail": "Only students can access performance analytics."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        student = Student.objects.get(user=request.user)
        
        # Get project submissions with grades
        project_submissions = ProjectSubmission.objects.filter(student=student)
        
        # Calculate performance metrics
        total_projects = project_submissions.count()
        completed_projects = project_submissions.filter(status='approved').count()
        average_grade = 0
        
        if total_projects > 0:
            grades = [p.grade for p in project_submissions if p.grade is not None]
            if grades:
                average_grade = sum(grades) / len(grades)
        
        # Grade distribution
        grade_distribution = {
            'A (90-100)': project_submissions.filter(grade__gte=90).count(),
            'B (80-89)': project_submissions.filter(grade__gte=80, grade__lt=90).count(),
            'C (70-79)': project_submissions.filter(grade__gte=70, grade__lt=80).count(),
            'D (60-69)': project_submissions.filter(grade__gte=60, grade__lt=70).count(),
            'F (<60)': project_submissions.filter(grade__lt=60).count()
        }
        
        # Get attendance data
        attendance_data = Attendance.objects.filter(student=student).order_by('date')
        
        # Monthly performance trends
        monthly_data = []
        current_month = datetime.now().month
        for i in range(6):  # Last 6 months
            month = current_month - i
            year = datetime.now().year
            if month <= 0:
                month += 12
                year -= 1
            
            month_attendance = attendance_data.filter(
                date__month=month, 
                date__year=year
            )
            
            month_projects = project_submissions.filter(
                submission_date__month=month,
                submission_date__year=year
            )
            
            attendance_rate = 0
            if month_attendance.exists():
                present_count = month_attendance.filter(is_present=True).count()
                attendance_rate = (present_count / month_attendance.count()) * 100
            
            monthly_data.append({
                'month': datetime(year, month, 1).strftime('%b'),
                'attendance': round(attendance_rate, 1),
                'projects': month_projects.count(),
                'performance': round((attendance_rate + (month_projects.count() * 20)) / 2, 1)
            })
        
        monthly_data.reverse()  # Show chronologically
        
        # Skills assessment (mock data based on projects)
        skills_data = {
            'Frontend Development': min(85, 60 + (completed_projects * 5)),
            'Backend Development': min(80, 50 + (completed_projects * 6)),
            'Database Management': min(75, 45 + (completed_projects * 7)),
            'Problem Solving': min(90, 55 + (completed_projects * 8)),
            'Code Quality': min(85, 60 + (completed_projects * 5)),
            'Project Management': min(70, 40 + (completed_projects * 6))
        }
        
        # Performance rank calculation
        attendance_stats = Attendance.objects.filter(student=student).aggregate(
            total_days=models.Count('id'),
            present_days=models.Count('id', filter=models.Q(is_present=True))
        )
        
        attendance_percentage = 0
        if attendance_stats['total_days'] > 0:
            attendance_percentage = (attendance_stats['present_days'] / attendance_stats['total_days']) * 100
        
        performance_score = (attendance_percentage * 0.3) + (average_grade * 0.4) + (completed_projects * 10 * 0.3)
        
        if performance_score >= 85:
            rank_info = {'rank': 'Excellent', 'percentile': 95, 'color': '#10B981'}
        elif performance_score >= 75:
            rank_info = {'rank': 'Good', 'percentile': 80, 'color': '#3B82F6'}
        elif performance_score >= 65:
            rank_info = {'rank': 'Average', 'percentile': 60, 'color': '#F59E0B'}
        else:
            rank_info = {'rank': 'Needs Improvement', 'percentile': 40, 'color': '#EF4444'}
        
        analytics_data = {
            'overview': {
                'total_projects': total_projects,
                'completed_projects': completed_projects,
                'average_grade': round(average_grade, 1),
                'completion_rate': round((completed_projects / total_projects * 100), 1) if total_projects > 0 else 0,
                'attendance_percentage': round(attendance_percentage, 1)
            },
            'grade_distribution': grade_distribution,
            'monthly_trends': monthly_data,
            'skills_assessment': skills_data,
            'performance_rank': rank_info,
            'recent_submissions': [
                {
                    'id': sub.id,
                    'project_title': sub.project.title,
                    'status': sub.status,
                    'grade': sub.grade,
                    'submission_date': sub.submission_date,
                    'feedback': sub.feedback
                }
                for sub in project_submissions.order_by('-submission_date')[:10]
            ]
        }
        
        return Response(analytics_data)
        
    except Student.DoesNotExist:
        return Response(
            {"detail": "Student profile not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error in student_performance_analytics: {str(e)}")
        return Response(
            {"detail": f"Error retrieving performance analytics: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )