#!/usr/bin/env python
"""
Script to add final projects to courses that have fewer than 7 projects
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

def add_final_projects():
    """Add final projects to courses with fewer than 7 projects"""
    
    admin_user = CustomUser.objects.filter(role='admin').first()
    
    # Additional projects for courses that need more
    additional_projects = {
        'IT Security & Ethical Hacking': [
            {
                'title': 'Penetration Testing Framework',
                'description': 'Develop a comprehensive penetration testing framework with automated vulnerability scanning and reporting.',
                'technologies': ['Python', 'Nmap', 'Metasploit', 'Burp Suite', 'Kali Linux'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Digital Forensics Tool',
                'description': 'Create a digital forensics tool for analyzing system artifacts, network traffic, and recovering deleted data.',
                'technologies': ['Python', 'Volatility', 'Wireshark', 'Forensics', 'Data Recovery'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Security Awareness Training Platform',
                'description': 'Build a platform for security awareness training with phishing simulations and educational content.',
                'technologies': ['Web Development', 'Phishing Simulation', 'Training Modules'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            }
        ],
        'AWS/Azure Cloud': [
            {
                'title': 'Multi-Cloud Deployment Strategy',
                'description': 'Implement a multi-cloud deployment strategy using both AWS and Azure with disaster recovery planning.',
                'technologies': ['AWS', 'Azure', 'Multi-Cloud', 'Disaster Recovery', 'Terraform'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Cloud Cost Optimization Tool',
                'description': 'Develop a tool for monitoring and optimizing cloud costs across multiple cloud providers.',
                'technologies': ['AWS Cost Explorer', 'Azure Cost Management', 'Python', 'APIs'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'Serverless Application Architecture',
                'description': 'Design and implement a complete serverless application using cloud functions and managed services.',
                'technologies': ['AWS Lambda', 'Azure Functions', 'API Gateway', 'NoSQL'],
                'difficulty': 'advanced',
                'deadline_days': 35
            }
        ],
        'PGDIE - Industrial Engineering': [
            {
                'title': 'Supply Chain Optimization System',
                'description': 'Develop a supply chain optimization system using operations research techniques and data analytics.',
                'technologies': ['Python', 'Operations Research', 'Optimization', 'Data Analysis'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Quality Control Dashboard',
                'description': 'Create a quality control dashboard with statistical process control and defect tracking.',
                'technologies': ['Python', 'Statistical Analysis', 'Dashboard', 'Quality Control'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Production Planning System',
                'description': 'Build a production planning and scheduling system with resource optimization and capacity planning.',
                'technologies': ['Python', 'Scheduling Algorithms', 'Resource Planning', 'Optimization'],
                'difficulty': 'advanced',
                'deadline_days': 40
            }
        ],
        'PGDDA - Data Analytics': [
            {
                'title': 'Business Intelligence Dashboard',
                'description': 'Create a comprehensive business intelligence dashboard with KPI tracking and predictive analytics.',
                'technologies': ['Python', 'Tableau', 'Power BI', 'SQL', 'Predictive Analytics'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'Customer Analytics Platform',
                'description': 'Develop a customer analytics platform with segmentation, lifetime value prediction, and churn analysis.',
                'technologies': ['Python', 'Machine Learning', 'Customer Analytics', 'Visualization'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Real-time Analytics Engine',
                'description': 'Build a real-time analytics engine for processing streaming data and generating instant insights.',
                'technologies': ['Python', 'Apache Kafka', 'Stream Processing', 'Real-time Analytics'],
                'difficulty': 'advanced',
                'deadline_days': 38
            }
        ],
        'AIML Advanced Diploma': [
            {
                'title': 'Advanced Neural Network Architecture',
                'description': 'Design and implement advanced neural network architectures for complex problem solving.',
                'technologies': ['TensorFlow', 'PyTorch', 'Deep Learning', 'Neural Networks'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Computer Vision Application',
                'description': 'Develop a computer vision application with object detection, recognition, and tracking capabilities.',
                'technologies': ['OpenCV', 'TensorFlow', 'Computer Vision', 'Deep Learning'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Natural Language Processing System',
                'description': 'Create an advanced NLP system with sentiment analysis, text generation, and language understanding.',
                'technologies': ['NLTK', 'spaCy', 'Transformers', 'NLP', 'Deep Learning'],
                'difficulty': 'advanced',
                'deadline_days': 38
            }
        ],
        'Artificial Intelligence': [
            {
                'title': 'Expert System Development',
                'description': 'Build an expert system for decision making in a specific domain using knowledge representation.',
                'technologies': ['Python', 'Knowledge Base', 'Inference Engine', 'Expert Systems'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'Reinforcement Learning Agent',
                'description': 'Develop a reinforcement learning agent for game playing or autonomous decision making.',
                'technologies': ['Python', 'Reinforcement Learning', 'Q-Learning', 'Neural Networks'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'AI Ethics and Bias Detection',
                'description': 'Create a system for detecting and mitigating bias in AI models with ethical AI implementation.',
                'technologies': ['Python', 'Fairness Metrics', 'Bias Detection', 'Ethical AI'],
                'difficulty': 'advanced',
                'deadline_days': 32
            }
        ],
        'Big Data Analytics': [
            {
                'title': 'Distributed Computing Framework',
                'description': 'Implement a distributed computing framework for processing large-scale datasets across clusters.',
                'technologies': ['Apache Spark', 'Hadoop', 'Distributed Computing', 'Scala'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Real-time Big Data Pipeline',
                'description': 'Build a real-time big data processing pipeline with stream processing and analytics.',
                'technologies': ['Apache Kafka', 'Spark Streaming', 'Real-time Processing'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Big Data Visualization Platform',
                'description': 'Create a platform for visualizing and exploring large datasets with interactive dashboards.',
                'technologies': ['D3.js', 'Apache Spark', 'Visualization', 'Big Data'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            }
        ]
    }
    
    print("Adding final projects to courses with fewer than 7 projects...")
    
    projects_created = 0
    
    for course_title, projects in additional_projects.items():
        try:
            course = Course.objects.get(title=course_title)
            print(f"\nProcessing course: {course.title}")
            
            # Get existing batch or create new one
            batch = Batch.objects.filter(course=course).first()
            if not batch:
                batch = Batch.objects.create(
                    name=f"{course.title} - Final Batch 2024",
                    course=course
                )
            
            for project_data in projects:
                # Check if project exists
                if Project.objects.filter(title=project_data['title']).exists():
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
                
        except Course.DoesNotExist:
            print(f"Course '{course_title}' not found in database")
            continue
    
    print(f"\nFinal projects addition completed!")
    print(f"Total new projects created: {projects_created}")
    print(f"Total projects in database: {Project.objects.count()}")
    
    # Final comprehensive summary
    print("\n" + "="*60)
    print("COMPREHENSIVE PROJECT SUMMARY BY COURSE")
    print("="*60)
    
    courses = Course.objects.all().order_by('title')
    total_projects = 0
    
    for course in courses:
        course_batches = Batch.objects.filter(course=course)
        course_projects = Project.objects.filter(batch__in=course_batches).count()
        total_projects += course_projects
        
        # Get difficulty breakdown
        beginner = Project.objects.filter(batch__in=course_batches, difficulty='beginner').count()
        intermediate = Project.objects.filter(batch__in=course_batches, difficulty='intermediate').count()
        advanced = Project.objects.filter(batch__in=course_batches, difficulty='advanced').count()
        
        print(f"{course.title:35} | {course_projects:2} projects | B:{beginner} I:{intermediate} A:{advanced}")
    
    print("="*60)
    print(f"{'TOTAL PROJECTS ACROSS ALL COURSES':35} | {total_projects:2} projects")
    print("="*60)
    
    # Overall difficulty distribution
    total_beginner = Project.objects.filter(difficulty='beginner').count()
    total_intermediate = Project.objects.filter(difficulty='intermediate').count()
    total_advanced = Project.objects.filter(difficulty='advanced').count()
    
    print(f"\nOverall Difficulty Distribution:")
    print(f"  Beginner: {total_beginner} projects")
    print(f"  Intermediate: {total_intermediate} projects")
    print(f"  Advanced: {total_advanced} projects")

if __name__ == '__main__':
    add_final_projects()