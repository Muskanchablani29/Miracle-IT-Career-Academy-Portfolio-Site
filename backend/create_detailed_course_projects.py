#!/usr/bin/env python
"""
Script to create detailed, course-specific projects for each course
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

def create_detailed_projects():
    """Create detailed, course-specific projects"""
    
    admin_user = CustomUser.objects.filter(role='admin').first()
    if not admin_user:
        admin_user = CustomUser.objects.create_user(
            username='admin',
            email='admin@miracleit.com',
            password='admin123',
            role='admin'
        )
    
    # Detailed project templates for specific courses
    detailed_projects = {
        'PGDFE': [
            {
                'title': 'Responsive Portfolio Website',
                'description': 'Create a fully responsive personal portfolio website showcasing your frontend development skills. Include sections for about, skills, projects, testimonials, and contact with smooth animations and modern design.',
                'technologies': ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'SASS'],
                'difficulty': 'beginner',
                'deadline_days': 14
            },
            {
                'title': 'Interactive Todo Application',
                'description': 'Build a feature-rich todo application with drag-and-drop functionality, categories, due dates, priority levels, and local storage persistence.',
                'technologies': ['HTML', 'CSS', 'JavaScript', 'Local Storage', 'Drag & Drop API'],
                'difficulty': 'intermediate',
                'deadline_days': 18
            },
            {
                'title': 'Weather Dashboard with API Integration',
                'description': 'Develop a comprehensive weather dashboard that displays current weather, 7-day forecast, weather maps, and historical data using weather APIs.',
                'technologies': ['JavaScript', 'Weather API', 'Chart.js', 'Geolocation API'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'E-commerce Product Catalog',
                'description': 'Create a dynamic e-commerce product catalog with filtering, sorting, search functionality, shopping cart, and checkout process simulation.',
                'technologies': ['React', 'JavaScript', 'CSS Modules', 'Context API'],
                'difficulty': 'advanced',
                'deadline_days': 28
            },
            {
                'title': 'Social Media Dashboard',
                'description': 'Build a social media management dashboard with post scheduling, analytics visualization, multiple platform integration, and real-time notifications.',
                'technologies': ['React', 'Redux', 'Chart.js', 'WebSocket', 'REST API'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Progressive Web App (PWA)',
                'description': 'Develop a Progressive Web App with offline functionality, push notifications, app-like experience, and service worker implementation.',
                'technologies': ['JavaScript', 'Service Workers', 'PWA', 'IndexedDB'],
                'difficulty': 'advanced',
                'deadline_days': 30
            }
        ],
        'PGDSE': [
            {
                'title': 'RESTful API with Authentication',
                'description': 'Build a complete RESTful API with user authentication, JWT tokens, role-based access control, and comprehensive documentation.',
                'technologies': ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Real-time Chat Application',
                'description': 'Create a real-time chat application with multiple rooms, private messaging, file sharing, and online user status.',
                'technologies': ['Node.js', 'Socket.io', 'MongoDB', 'Express', 'JWT'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Microservices Architecture',
                'description': 'Design and implement a microservices-based application with API Gateway, service discovery, and inter-service communication.',
                'technologies': ['Node.js', 'Docker', 'Kubernetes', 'API Gateway', 'Redis'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'GraphQL API Server',
                'description': 'Develop a GraphQL API server with schema design, resolvers, subscriptions, and integration with multiple data sources.',
                'technologies': ['GraphQL', 'Apollo Server', 'MongoDB', 'Redis', 'DataLoader'],
                'difficulty': 'advanced',
                'deadline_days': 30
            },
            {
                'title': 'Serverless Application',
                'description': 'Build a serverless application using cloud functions, event-driven architecture, and managed database services.',
                'technologies': ['AWS Lambda', 'API Gateway', 'DynamoDB', 'S3', 'CloudFormation'],
                'difficulty': 'advanced',
                'deadline_days': 35
            }
        ],
        'Data Science': [
            {
                'title': 'Exploratory Data Analysis Project',
                'description': 'Perform comprehensive exploratory data analysis on a real-world dataset with statistical insights, visualizations, and data cleaning.',
                'technologies': ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter'],
                'difficulty': 'beginner',
                'deadline_days': 14
            },
            {
                'title': 'Customer Churn Prediction',
                'description': 'Build a machine learning model to predict customer churn using classification algorithms and feature engineering techniques.',
                'technologies': ['Python', 'Scikit-learn', 'Pandas', 'Feature Engineering'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Sales Forecasting Dashboard',
                'description': 'Create an interactive dashboard for sales forecasting using time series analysis and predictive modeling.',
                'technologies': ['Python', 'Streamlit', 'Prophet', 'Plotly', 'Time Series'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Recommendation System',
                'description': 'Develop a recommendation system using collaborative filtering and content-based approaches with evaluation metrics.',
                'technologies': ['Python', 'Surprise', 'Scikit-learn', 'Matrix Factorization'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Deep Learning Image Classifier',
                'description': 'Build a deep learning model for image classification using convolutional neural networks and transfer learning.',
                'technologies': ['Python', 'TensorFlow', 'Keras', 'CNN', 'Transfer Learning'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'NLP Sentiment Analysis System',
                'description': 'Create a natural language processing system for sentiment analysis with text preprocessing and model deployment.',
                'technologies': ['Python', 'NLTK', 'spaCy', 'Transformers', 'Flask'],
                'difficulty': 'advanced',
                'deadline_days': 38
            }
        ],
        'Cyber Security': [
            {
                'title': 'Network Security Scanner',
                'description': 'Develop a network security scanner that identifies vulnerabilities, open ports, and security misconfigurations.',
                'technologies': ['Python', 'Nmap', 'Socket Programming', 'Threading'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Web Application Security Audit',
                'description': 'Perform a comprehensive security audit of a web application including OWASP Top 10 vulnerabilities testing.',
                'technologies': ['OWASP ZAP', 'Burp Suite', 'SQL Injection', 'XSS'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Intrusion Detection System',
                'description': 'Build an intrusion detection system that monitors network traffic and identifies suspicious activities.',
                'technologies': ['Python', 'Scapy', 'Machine Learning', 'Network Analysis'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Cryptography Implementation',
                'description': 'Implement various cryptographic algorithms and create a secure communication system with encryption/decryption.',
                'technologies': ['Python', 'Cryptography', 'RSA', 'AES', 'Digital Signatures'],
                'difficulty': 'advanced',
                'deadline_days': 30
            },
            {
                'title': 'Security Information Dashboard',
                'description': 'Create a security information and event management (SIEM) dashboard for monitoring security events.',
                'technologies': ['Python', 'ELK Stack', 'Log Analysis', 'Visualization'],
                'difficulty': 'advanced',
                'deadline_days': 40
            }
        ],
        'Cloud Computing': [
            {
                'title': 'Multi-tier Web Application on AWS',
                'description': 'Deploy a multi-tier web application on AWS with load balancing, auto-scaling, and database replication.',
                'technologies': ['AWS EC2', 'ELB', 'RDS', 'Auto Scaling', 'VPC'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Serverless Data Processing Pipeline',
                'description': 'Build a serverless data processing pipeline using cloud functions, queues, and managed databases.',
                'technologies': ['AWS Lambda', 'SQS', 'DynamoDB', 'S3', 'CloudWatch'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Container Orchestration with Kubernetes',
                'description': 'Deploy and manage containerized applications using Kubernetes with service mesh and monitoring.',
                'technologies': ['Kubernetes', 'Docker', 'Helm', 'Istio', 'Prometheus'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Infrastructure as Code (IaC)',
                'description': 'Implement infrastructure as code using Terraform and CloudFormation for automated cloud resource management.',
                'technologies': ['Terraform', 'CloudFormation', 'AWS', 'Infrastructure as Code'],
                'difficulty': 'advanced',
                'deadline_days': 30
            },
            {
                'title': 'Cloud Security Implementation',
                'description': 'Implement comprehensive cloud security measures including IAM, encryption, monitoring, and compliance.',
                'technologies': ['AWS IAM', 'KMS', 'CloudTrail', 'Security Groups', 'WAF'],
                'difficulty': 'advanced',
                'deadline_days': 32
            }
        ],
        'Java': [
            {
                'title': 'Library Management System',
                'description': 'Create a comprehensive library management system with book inventory, member management, and borrowing tracking.',
                'technologies': ['Java', 'Swing', 'JDBC', 'MySQL', 'MVC Pattern'],
                'difficulty': 'beginner',
                'deadline_days': 18
            },
            {
                'title': 'Banking Application with GUI',
                'description': 'Develop a banking application with account management, transactions, and report generation using Java Swing.',
                'technologies': ['Java', 'Swing', 'JDBC', 'MySQL', 'Exception Handling'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'E-commerce Web Application',
                'description': 'Build a full-featured e-commerce web application using Spring Boot with product catalog and order management.',
                'technologies': ['Spring Boot', 'Spring MVC', 'JPA', 'Thymeleaf', 'MySQL'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'RESTful Web Services',
                'description': 'Create RESTful web services with Spring Boot, including API documentation, testing, and security implementation.',
                'technologies': ['Spring Boot', 'REST API', 'Spring Security', 'Swagger', 'JUnit'],
                'difficulty': 'advanced',
                'deadline_days': 28
            },
            {
                'title': 'Microservices with Spring Cloud',
                'description': 'Implement a microservices architecture using Spring Cloud with service discovery, circuit breakers, and API gateway.',
                'technologies': ['Spring Cloud', 'Eureka', 'Zuul', 'Hystrix', 'Docker'],
                'difficulty': 'advanced',
                'deadline_days': 40
            }
        ],
        'Python Programming': [
            {
                'title': 'Personal Finance Tracker',
                'description': 'Build a personal finance tracking application with expense categorization, budget planning, and financial reports.',
                'technologies': ['Python', 'Tkinter', 'SQLite', 'Matplotlib', 'CSV'],
                'difficulty': 'beginner',
                'deadline_days': 16
            },
            {
                'title': 'Web Scraping and Data Analysis',
                'description': 'Create a web scraping tool that extracts data from websites and performs analysis with visualizations.',
                'technologies': ['Python', 'BeautifulSoup', 'Requests', 'Pandas', 'Matplotlib'],
                'difficulty': 'intermediate',
                'deadline_days': 21
            },
            {
                'title': 'Django Web Application',
                'description': 'Develop a full-featured web application using Django with user authentication, CRUD operations, and admin panel.',
                'technologies': ['Django', 'Python', 'PostgreSQL', 'Bootstrap', 'Django REST'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'API Development with FastAPI',
                'description': 'Build a high-performance API using FastAPI with automatic documentation, validation, and async support.',
                'technologies': ['FastAPI', 'Python', 'Pydantic', 'SQLAlchemy', 'PostgreSQL'],
                'difficulty': 'advanced',
                'deadline_days': 25
            },
            {
                'title': 'Machine Learning Pipeline',
                'description': 'Create an end-to-end machine learning pipeline with data preprocessing, model training, and deployment.',
                'technologies': ['Python', 'Scikit-learn', 'MLflow', 'Docker', 'Flask'],
                'difficulty': 'advanced',
                'deadline_days': 35
            }
        ]
    }
    
    print("Creating detailed course-specific projects...")
    
    courses = Course.objects.all()
    projects_created = 0
    
    for course in courses:
        print(f"\nProcessing course: {course.title}")
        
        # Get or create batch
        batch, created = Batch.objects.get_or_create(
            name=f"{course.title} - Advanced Batch 2024",
            defaults={'course': course}
        )
        
        # Get specific projects for this course
        course_projects = detailed_projects.get(course.title, [])
        
        if course_projects:
            print(f"  Found {len(course_projects)} specific projects for {course.title}")
            
            for project_data in course_projects:
                # Check if project exists
                if Project.objects.filter(title=project_data['title'], batch=batch).exists():
                    print(f"    Project '{project_data['title']}' already exists")
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
                
                print(f"    Created: {project.title} ({project.difficulty})")
                projects_created += 1
        else:
            print(f"  No specific projects found for {course.title}")
    
    print(f"\nDetailed project creation completed!")
    print(f"Total new projects created: {projects_created}")
    print(f"Total projects in database: {Project.objects.count()}")
    
    # Summary by difficulty
    print("\nProjects by difficulty:")
    for difficulty in ['beginner', 'intermediate', 'advanced']:
        count = Project.objects.filter(difficulty=difficulty).count()
        print(f"  {difficulty.title()}: {count} projects")

if __name__ == '__main__':
    create_detailed_projects()