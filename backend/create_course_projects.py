#!/usr/bin/env python
"""
Script to create projects for each course with varying difficulty levels
"""
import os
import sys
import django
from datetime import date, timedelta

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from users.models import Project, Batch, CustomUser

def create_course_projects():
    """Create projects for each course"""
    
    # Get or create a default batch for each course
    admin_user = CustomUser.objects.filter(role='admin').first()
    if not admin_user:
        print("No admin user found. Creating default admin...")
        admin_user = CustomUser.objects.create_user(
            username='admin',
            email='admin@miracleit.com',
            password='admin123',
            role='admin'
        )
    
    # Project templates for different courses
    project_templates = {
        'Full Stack Web Development with MERN': [
            {
                'title': 'Personal Portfolio Website',
                'description': 'Create a responsive personal portfolio website showcasing your skills, projects, and experience. Include sections for about, skills, projects, and contact information.',
                'technologies': ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
                'difficulty': 'beginner',
                'deadline_days': 14
            },
            {
                'title': 'Todo List Application',
                'description': 'Build a dynamic todo list application with features to add, edit, delete, and mark tasks as complete. Include local storage functionality.',
                'technologies': ['HTML', 'CSS', 'JavaScript', 'Local Storage'],
                'difficulty': 'beginner',
                'deadline_days': 10
            },
            {
                'title': 'Weather Dashboard',
                'description': 'Create a weather dashboard that fetches weather data from an API and displays current weather and forecast for different cities.',
                'technologies': ['HTML', 'CSS', 'JavaScript', 'Weather API'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'React Blog Application',
                'description': 'Develop a blog application using React with features for creating, reading, updating, and deleting blog posts. Include user authentication.',
                'technologies': ['React', 'JavaScript', 'CSS', 'React Router'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'E-commerce Shopping Cart',
                'description': 'Build a complete e-commerce application with product catalog, shopping cart, user authentication, and payment integration.',
                'technologies': ['React', 'Node.js', 'Express', 'MongoDB'],
                'difficulty': 'advanced',
                'deadline_days': 45
            },
            {
                'title': 'Social Media Dashboard',
                'description': 'Create a social media dashboard with real-time updates, user profiles, post creation, and interaction features.',
                'technologies': ['React', 'Node.js', 'Socket.io', 'MongoDB'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Task Management System',
                'description': 'Develop a comprehensive task management system with team collaboration, project tracking, and deadline management.',
                'technologies': ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
                'difficulty': 'advanced',
                'deadline_days': 40
            }
        ],
        'Python Programming for Beginners': [
            {
                'title': 'Calculator Application',
                'description': 'Create a simple calculator application that can perform basic arithmetic operations with a user-friendly interface.',
                'technologies': ['Python', 'Tkinter'],
                'difficulty': 'beginner',
                'deadline_days': 7
            },
            {
                'title': 'Number Guessing Game',
                'description': 'Build an interactive number guessing game where the computer generates a random number and the user tries to guess it.',
                'technologies': ['Python', 'Random Module'],
                'difficulty': 'beginner',
                'deadline_days': 5
            },
            {
                'title': 'Student Grade Management System',
                'description': 'Develop a system to manage student grades with features to add students, record grades, and generate reports.',
                'technologies': ['Python', 'File Handling', 'CSV'],
                'difficulty': 'intermediate',
                'deadline_days': 14
            },
            {
                'title': 'Web Scraper for News Articles',
                'description': 'Create a web scraper that extracts news articles from websites and saves them in a structured format.',
                'technologies': ['Python', 'BeautifulSoup', 'Requests'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Personal Finance Tracker',
                'description': 'Build a personal finance tracking application with expense categorization, budget planning, and financial reports.',
                'technologies': ['Python', 'SQLite', 'Matplotlib'],
                'difficulty': 'advanced',
                'deadline_days': 30
            },
            {
                'title': 'Inventory Management System',
                'description': 'Develop a complete inventory management system for small businesses with product tracking and sales reporting.',
                'technologies': ['Python', 'SQLite', 'Tkinter'],
                'difficulty': 'advanced',
                'deadline_days': 35
            }
        ],
        'Machine Learning with Python': [
            {
                'title': 'House Price Prediction',
                'description': 'Build a machine learning model to predict house prices based on various features like location, size, and amenities.',
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Customer Segmentation Analysis',
                'description': 'Perform customer segmentation using clustering algorithms to identify different customer groups for marketing strategies.',
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'Seaborn'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Sentiment Analysis of Social Media',
                'description': 'Create a sentiment analysis system to analyze social media posts and determine public opinion on various topics.',
                'technologies': ['Python', 'NLTK', 'Scikit-learn', 'Twitter API'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Image Classification System',
                'description': 'Develop an image classification system using deep learning to categorize images into different classes.',
                'technologies': ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
                'difficulty': 'advanced',
                'deadline_days': 42
            },
            {
                'title': 'Stock Price Prediction Model',
                'description': 'Build a time series forecasting model to predict stock prices using historical data and technical indicators.',
                'technologies': ['Python', 'Pandas', 'TensorFlow', 'Yahoo Finance API'],
                'difficulty': 'advanced',
                'deadline_days': 45
            },
            {
                'title': 'Recommendation System',
                'description': 'Create a recommendation system for movies or products using collaborative filtering and content-based approaches.',
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'Surprise'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Fraud Detection System',
                'description': 'Develop a fraud detection system for financial transactions using anomaly detection and classification algorithms.',
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'Imbalanced-learn'],
                'difficulty': 'advanced',
                'deadline_days': 38
            }
        ],
        'Java Programming Fundamentals': [
            {
                'title': 'Library Management System',
                'description': 'Create a console-based library management system with features for book management, member registration, and borrowing records.',
                'technologies': ['Java', 'OOP Concepts', 'File I/O'],
                'difficulty': 'beginner',
                'deadline_days': 14
            },
            {
                'title': 'Banking System Simulation',
                'description': 'Develop a banking system simulation with account management, transactions, and balance tracking functionality.',
                'technologies': ['Java', 'OOP', 'Exception Handling'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Student Information System',
                'description': 'Build a comprehensive student information system with course enrollment, grade management, and report generation.',
                'technologies': ['Java', 'JDBC', 'MySQL'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'E-commerce Console Application',
                'description': 'Create a console-based e-commerce application with product catalog, shopping cart, and order management.',
                'technologies': ['Java', 'Collections', 'File Handling'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Hospital Management System',
                'description': 'Develop a hospital management system with patient records, appointment scheduling, and doctor management.',
                'technologies': ['Java', 'JDBC', 'MySQL', 'Swing'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Online Quiz Application',
                'description': 'Build an online quiz application with question management, timer functionality, and result calculation.',
                'technologies': ['Java', 'Swing', 'JDBC', 'MySQL'],
                'difficulty': 'advanced',
                'deadline_days': 30
            }
        ],
        'Cloud Computing with AWS': [
            {
                'title': 'Static Website Hosting on S3',
                'description': 'Deploy a static website on Amazon S3 with CloudFront distribution for global content delivery.',
                'technologies': ['AWS S3', 'CloudFront', 'Route 53', 'HTML/CSS'],
                'difficulty': 'beginner',
                'deadline_days': 10
            },
            {
                'title': 'Serverless Web Application',
                'description': 'Build a serverless web application using AWS Lambda, API Gateway, and DynamoDB for backend services.',
                'technologies': ['AWS Lambda', 'API Gateway', 'DynamoDB', 'JavaScript'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Auto-Scaling Web Application',
                'description': 'Deploy a web application on EC2 with auto-scaling groups, load balancers, and RDS database.',
                'technologies': ['AWS EC2', 'Auto Scaling', 'ELB', 'RDS'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'CI/CD Pipeline with CodePipeline',
                'description': 'Set up a complete CI/CD pipeline using AWS CodePipeline, CodeBuild, and CodeDeploy for automated deployments.',
                'technologies': ['AWS CodePipeline', 'CodeBuild', 'CodeDeploy', 'GitHub'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Microservices Architecture on EKS',
                'description': 'Deploy a microservices application on Amazon EKS with service mesh and monitoring solutions.',
                'technologies': ['AWS EKS', 'Docker', 'Kubernetes', 'Istio'],
                'difficulty': 'advanced',
                'deadline_days': 45
            },
            {
                'title': 'Data Analytics Pipeline',
                'description': 'Build a data analytics pipeline using AWS services for data ingestion, processing, and visualization.',
                'technologies': ['AWS Kinesis', 'Lambda', 'S3', 'QuickSight'],
                'difficulty': 'advanced',
                'deadline_days': 40
            }
        ]
    }
    
    print("Creating projects for each course...")
    
    courses = Course.objects.all()
    total_projects_created = 0
    
    for course in courses:
        print(f"\nProcessing course: {course.title}")
        
        # Get or create a batch for this course
        batch, created = Batch.objects.get_or_create(
            name=f"{course.title} - Batch 2024",
            defaults={'course': course}
        )
        
        if created:
            print(f"Created batch: {batch.name}")
        
        # Get projects for this course
        course_projects = project_templates.get(course.title, [])
        
        if not course_projects:
            # Create generic projects if no specific templates found
            course_projects = [
                {
                    'title': f'{course.title} - Basic Project',
                    'description': f'A foundational project for {course.title} covering basic concepts and implementation.',
                    'technologies': ['Programming', 'Problem Solving'],
                    'difficulty': 'beginner',
                    'deadline_days': 14
                },
                {
                    'title': f'{course.title} - Intermediate Project',
                    'description': f'An intermediate-level project for {course.title} with practical applications.',
                    'technologies': ['Advanced Concepts', 'Best Practices'],
                    'difficulty': 'intermediate',
                    'deadline_days': 21
                },
                {
                    'title': f'{course.title} - Advanced Project',
                    'description': f'A comprehensive advanced project for {course.title} demonstrating mastery.',
                    'technologies': ['Expert Level', 'Industry Standards'],
                    'difficulty': 'advanced',
                    'deadline_days': 35
                },
                {
                    'title': f'{course.title} - Capstone Project',
                    'description': f'A capstone project for {course.title} integrating all learned concepts.',
                    'technologies': ['Full Stack', 'Real World Application'],
                    'difficulty': 'advanced',
                    'deadline_days': 45
                },
                {
                    'title': f'{course.title} - Portfolio Project',
                    'description': f'A portfolio-worthy project for {course.title} to showcase skills to employers.',
                    'technologies': ['Professional Grade', 'Industry Ready'],
                    'difficulty': 'advanced',
                    'deadline_days': 30
                }
            ]
        
        # Create projects for this course
        for project_data in course_projects:
            # Check if project already exists
            if Project.objects.filter(title=project_data['title'], batch=batch).exists():
                print(f"  Project '{project_data['title']}' already exists, skipping...")
                continue
            
            # Calculate deadline
            deadline = date.today() + timedelta(days=project_data['deadline_days'])
            
            # Create project
            project = Project.objects.create(
                title=project_data['title'],
                description=project_data['description'],
                technologies=project_data['technologies'],
                batch=batch,
                difficulty=project_data['difficulty'],
                deadline=deadline,
                status='active',
                created_by=admin_user
            )
            
            print(f"  Created project: {project.title} (Difficulty: {project.difficulty})")
            total_projects_created += 1
    
    print(f"\n✅ Project creation completed!")
    print(f"📊 Total projects created: {total_projects_created}")
    print(f"📚 Total courses processed: {courses.count()}")
    print(f"🎯 Total projects in database: {Project.objects.count()}")
    
    # Display summary by course
    print("\n📋 Summary by Course:")
    for course in courses:
        course_batches = Batch.objects.filter(course=course)
        total_course_projects = Project.objects.filter(batch__in=course_batches).count()
        print(f"  {course.title}: {total_course_projects} projects")

if __name__ == '__main__':
    create_course_projects()