#!/usr/bin/env python
"""
Script to create projects for remaining courses that don't have specific projects yet
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

def create_remaining_projects():
    """Create projects for courses that don't have detailed projects yet"""
    
    admin_user = CustomUser.objects.filter(role='admin').first()
    
    # Projects for remaining courses
    remaining_course_projects = {
        'Mern Stack Development': [
            {
                'title': 'MERN Stack Blog Platform',
                'description': 'Build a full-stack blog platform with user authentication, post creation, comments, and admin dashboard using MongoDB, Express, React, and Node.js.',
                'technologies': ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'Real-time Chat Application',
                'description': 'Create a real-time chat application with multiple rooms, private messaging, and online status using Socket.io and MERN stack.',
                'technologies': ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'E-commerce MERN Application',
                'description': 'Develop a complete e-commerce platform with product management, shopping cart, payment integration, and order tracking.',
                'technologies': ['React', 'Redux', 'Node.js', 'MongoDB', 'Stripe API'],
                'difficulty': 'advanced',
                'deadline_days': 45
            },
            {
                'title': 'Task Management Dashboard',
                'description': 'Build a collaborative task management system with team features, project tracking, and real-time updates.',
                'technologies': ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Material-UI'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Social Media Platform',
                'description': 'Create a social media platform with user profiles, posts, likes, comments, and friend connections.',
                'technologies': ['React', 'Node.js', 'MongoDB', 'Cloudinary', 'JWT'],
                'difficulty': 'advanced',
                'deadline_days': 40
            }
        ],
        'Full Stack Web Development': [
            {
                'title': 'Restaurant Management System',
                'description': 'Build a comprehensive restaurant management system with menu management, order processing, and customer feedback.',
                'technologies': ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Online Learning Platform',
                'description': 'Create an online learning platform with course management, video streaming, quizzes, and progress tracking.',
                'technologies': ['React', 'Node.js', 'MongoDB', 'Video.js', 'Stripe'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Job Portal Website',
                'description': 'Develop a job portal with job posting, application management, resume builder, and employer dashboard.',
                'technologies': ['React', 'Node.js', 'PostgreSQL', 'File Upload', 'Email'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Event Management System',
                'description': 'Build an event management platform with event creation, ticket booking, payment processing, and attendee management.',
                'technologies': ['Vue.js', 'Express', 'MongoDB', 'Payment Gateway', 'QR Code'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'Real Estate Platform',
                'description': 'Create a real estate platform with property listings, search filters, virtual tours, and agent management.',
                'technologies': ['React', 'Node.js', 'MongoDB', 'Google Maps API', 'Image Upload'],
                'difficulty': 'advanced',
                'deadline_days': 38
            }
        ],
        'C/ C++/ Data Structure': [
            {
                'title': 'Student Management System in C++',
                'description': 'Develop a student management system using C++ with file handling, data structures, and menu-driven interface.',
                'technologies': ['C++', 'File Handling', 'STL', 'OOP'],
                'difficulty': 'beginner',
                'deadline_days': 18
            },
            {
                'title': 'Banking System with Data Structures',
                'description': 'Create a banking system implementing various data structures like linked lists, queues, and trees for efficient operations.',
                'technologies': ['C++', 'Linked Lists', 'Queues', 'Binary Trees'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Graph Algorithms Implementation',
                'description': 'Implement various graph algorithms including shortest path, minimum spanning tree, and graph traversal algorithms.',
                'technologies': ['C++', 'Graph Theory', 'Algorithms', 'STL'],
                'difficulty': 'advanced',
                'deadline_days': 30
            },
            {
                'title': 'Sorting and Searching Algorithms',
                'description': 'Implement and analyze various sorting and searching algorithms with performance comparison and visualization.',
                'technologies': ['C++', 'Algorithms', 'Time Complexity', 'Analysis'],
                'difficulty': 'intermediate',
                'deadline_days': 20
            },
            {
                'title': 'Memory Management System',
                'description': 'Design a memory management system demonstrating dynamic memory allocation, garbage collection, and memory optimization.',
                'technologies': ['C++', 'Memory Management', 'Pointers', 'Dynamic Allocation'],
                'difficulty': 'advanced',
                'deadline_days': 35
            }
        ],
        'AI and Machine Learning': [
            {
                'title': 'Chatbot with Natural Language Processing',
                'description': 'Build an intelligent chatbot using NLP techniques, intent recognition, and response generation.',
                'technologies': ['Python', 'NLTK', 'TensorFlow', 'Dialogflow', 'Flask'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Computer Vision Object Detection',
                'description': 'Develop an object detection system using computer vision techniques and deep learning models.',
                'technologies': ['Python', 'OpenCV', 'YOLO', 'TensorFlow', 'CNN'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Predictive Analytics Dashboard',
                'description': 'Create a predictive analytics dashboard with machine learning models for business forecasting.',
                'technologies': ['Python', 'Scikit-learn', 'Streamlit', 'Plotly', 'Time Series'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'AI-Powered Recommendation Engine',
                'description': 'Build a sophisticated recommendation engine using collaborative filtering and deep learning techniques.',
                'technologies': ['Python', 'TensorFlow', 'Neural Networks', 'Matrix Factorization'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Automated Trading System',
                'description': 'Develop an automated trading system using machine learning for market prediction and algorithmic trading.',
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'Trading APIs', 'Backtesting'],
                'difficulty': 'advanced',
                'deadline_days': 45
            }
        ],
        'Devops': [
            {
                'title': 'CI/CD Pipeline Implementation',
                'description': 'Set up a complete CI/CD pipeline with automated testing, building, and deployment using Jenkins and Docker.',
                'technologies': ['Jenkins', 'Docker', 'Git', 'Kubernetes', 'Ansible'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Infrastructure as Code with Terraform',
                'description': 'Implement infrastructure as code using Terraform for automated cloud resource provisioning and management.',
                'technologies': ['Terraform', 'AWS', 'Infrastructure as Code', 'CloudFormation'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Monitoring and Logging System',
                'description': 'Build a comprehensive monitoring and logging system using ELK stack and Prometheus for application observability.',
                'technologies': ['ELK Stack', 'Prometheus', 'Grafana', 'Docker', 'Kubernetes'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Containerized Microservices Deployment',
                'description': 'Deploy and manage microservices using Docker containers and Kubernetes orchestration.',
                'technologies': ['Docker', 'Kubernetes', 'Microservices', 'Service Mesh', 'Helm'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Automated Security Scanning Pipeline',
                'description': 'Implement automated security scanning in CI/CD pipeline with vulnerability assessment and compliance checking.',
                'technologies': ['Security Scanning', 'OWASP', 'SonarQube', 'Jenkins', 'Docker'],
                'difficulty': 'advanced',
                'deadline_days': 32
            }
        ],
        'BigData': [
            {
                'title': 'Hadoop Data Processing Pipeline',
                'description': 'Build a big data processing pipeline using Hadoop ecosystem for large-scale data analysis and processing.',
                'technologies': ['Hadoop', 'HDFS', 'MapReduce', 'Hive', 'Pig'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            },
            {
                'title': 'Real-time Stream Processing with Kafka',
                'description': 'Implement real-time data streaming and processing using Apache Kafka and Spark Streaming.',
                'technologies': ['Apache Kafka', 'Spark Streaming', 'Scala', 'Zookeeper'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Data Lake Architecture',
                'description': 'Design and implement a data lake architecture for storing and processing structured and unstructured data.',
                'technologies': ['AWS S3', 'Apache Spark', 'Delta Lake', 'Databricks'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'NoSQL Database Implementation',
                'description': 'Implement and optimize NoSQL databases for big data applications with performance tuning.',
                'technologies': ['MongoDB', 'Cassandra', 'HBase', 'Redis', 'Performance Tuning'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Big Data Analytics Dashboard',
                'description': 'Create an analytics dashboard for big data visualization and business intelligence reporting.',
                'technologies': ['Apache Spark', 'Tableau', 'Power BI', 'Python', 'SQL'],
                'difficulty': 'intermediate',
                'deadline_days': 32
            }
        ],
        'PHP Development': [
            {
                'title': 'Content Management System',
                'description': 'Build a custom content management system with user roles, content editing, and theme management.',
                'technologies': ['PHP', 'MySQL', 'Bootstrap', 'jQuery', 'CKEditor'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'E-commerce Website with PHP',
                'description': 'Develop a complete e-commerce website with product catalog, shopping cart, and payment integration.',
                'technologies': ['PHP', 'MySQL', 'PayPal API', 'Bootstrap', 'Session Management'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'RESTful API with Laravel',
                'description': 'Create a RESTful API using Laravel framework with authentication, validation, and documentation.',
                'technologies': ['Laravel', 'PHP', 'MySQL', 'JWT', 'Swagger'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Social Networking Platform',
                'description': 'Build a social networking platform with user profiles, posts, messaging, and friend connections.',
                'technologies': ['PHP', 'MySQL', 'AJAX', 'WebSocket', 'File Upload'],
                'difficulty': 'advanced',
                'deadline_days': 40
            },
            {
                'title': 'Online Booking System',
                'description': 'Develop an online booking system for hotels or services with calendar integration and payment processing.',
                'technologies': ['PHP', 'MySQL', 'Calendar API', 'Payment Gateway', 'Email'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            }
        ],
        'Machine Learning': [
            {
                'title': 'Stock Price Prediction Model',
                'description': 'Build a machine learning model to predict stock prices using historical data and technical indicators.',
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'LSTM', 'Yahoo Finance API'],
                'difficulty': 'intermediate',
                'deadline_days': 28
            },
            {
                'title': 'Medical Diagnosis System',
                'description': 'Develop a medical diagnosis system using machine learning for disease prediction based on symptoms.',
                'technologies': ['Python', 'Scikit-learn', 'Medical Data', 'Classification', 'Flask'],
                'difficulty': 'advanced',
                'deadline_days': 35
            },
            {
                'title': 'Fraud Detection System',
                'description': 'Create a fraud detection system for financial transactions using anomaly detection algorithms.',
                'technologies': ['Python', 'Scikit-learn', 'Anomaly Detection', 'Imbalanced Data'],
                'difficulty': 'advanced',
                'deadline_days': 32
            },
            {
                'title': 'Customer Lifetime Value Prediction',
                'description': 'Build a model to predict customer lifetime value using regression and classification techniques.',
                'technologies': ['Python', 'Pandas', 'Scikit-learn', 'Feature Engineering'],
                'difficulty': 'intermediate',
                'deadline_days': 25
            },
            {
                'title': 'Text Classification System',
                'description': 'Develop a text classification system for document categorization using NLP and machine learning.',
                'technologies': ['Python', 'NLTK', 'Scikit-learn', 'TF-IDF', 'Word2Vec'],
                'difficulty': 'intermediate',
                'deadline_days': 30
            }
        ]
    }
    
    print("Creating projects for remaining courses...")
    
    projects_created = 0
    
    for course_title, projects in remaining_course_projects.items():
        try:
            course = Course.objects.get(title=course_title)
            print(f"\nProcessing course: {course.title}")
            
            # Get or create batch
            batch, created = Batch.objects.get_or_create(
                name=f"{course.title} - Professional Batch 2024",
                defaults={'course': course}
            )
            
            for project_data in projects:
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
                
        except Course.DoesNotExist:
            print(f"Course '{course_title}' not found in database")
            continue
    
    print(f"\nRemaining projects creation completed!")
    print(f"Total new projects created: {projects_created}")
    print(f"Total projects in database: {Project.objects.count()}")
    
    # Final summary
    print("\nFinal Summary by Course:")
    courses = Course.objects.all()
    for course in courses:
        course_batches = Batch.objects.filter(course=course)
        total_projects = Project.objects.filter(batch__in=course_batches).count()
        print(f"  {course.title}: {total_projects} projects")

if __name__ == '__main__':
    create_remaining_projects()