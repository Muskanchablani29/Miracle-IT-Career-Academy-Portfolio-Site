#!/usr/bin/env python
"""
Script to create sample courses for testing the CourseDetails functionality
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, CourseSyllabus, SyllabusItem, Video

def create_sample_courses():
    """Create sample courses with syllabus and videos"""
    
    # Sample course data
    courses_data = [
        {
            'title': 'Full Stack Web Development with MERN',
            'description': 'Learn to build modern web applications using MongoDB, Express.js, React, and Node.js. This comprehensive course covers both frontend and backend development.',
            'duration': '6 months',
            'level': 'Intermediate',
            'price': 15000.00,
            'discount_price': 12000.00,
            'is_certified': True,
            'internship_duration': '3 months',
            'preview_duration': 300,
            'syllabus': [
                {
                    'title': 'Introduction to Web Development',
                    'order': 1,
                    'items': [
                        {'title': 'HTML5 Fundamentals', 'description': 'Learn the basics of HTML5 and semantic markup'},
                        {'title': 'CSS3 and Responsive Design', 'description': 'Master CSS3 features and responsive web design'},
                        {'title': 'JavaScript ES6+', 'description': 'Modern JavaScript features and best practices'}
                    ]
                },
                {
                    'title': 'React.js Frontend Development',
                    'order': 2,
                    'items': [
                        {'title': 'React Components and JSX', 'description': 'Building reusable components with JSX'},
                        {'title': 'State Management with Hooks', 'description': 'Managing component state with React Hooks'},
                        {'title': 'React Router and Navigation', 'description': 'Client-side routing in React applications'}
                    ]
                },
                {
                    'title': 'Backend Development with Node.js',
                    'order': 3,
                    'items': [
                        {'title': 'Node.js and Express.js', 'description': 'Building REST APIs with Express.js'},
                        {'title': 'MongoDB and Mongoose', 'description': 'Database operations with MongoDB'},
                        {'title': 'Authentication and Security', 'description': 'Implementing JWT authentication'}
                    ]
                }
            ],
            'videos': [
                {
                    'title': 'Course Introduction and Setup',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 0
                },
                {
                    'title': 'HTML5 Basics',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 1
                },
                {
                    'title': 'CSS3 Fundamentals',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 2
                }
            ]
        },
        {
            'title': 'Python Programming for Beginners',
            'description': 'Start your programming journey with Python. Learn the fundamentals of programming and build real-world projects.',
            'duration': '4 months',
            'level': 'Beginner',
            'price': 8000.00,
            'discount_price': 6000.00,
            'is_certified': True,
            'internship_duration': '2 months',
            'preview_duration': 240,
            'syllabus': [
                {
                    'title': 'Python Basics',
                    'order': 1,
                    'items': [
                        {'title': 'Variables and Data Types', 'description': 'Understanding Python data types'},
                        {'title': 'Control Structures', 'description': 'If statements, loops, and conditions'},
                        {'title': 'Functions and Modules', 'description': 'Creating reusable code with functions'}
                    ]
                },
                {
                    'title': 'Object-Oriented Programming',
                    'order': 2,
                    'items': [
                        {'title': 'Classes and Objects', 'description': 'Introduction to OOP concepts'},
                        {'title': 'Inheritance and Polymorphism', 'description': 'Advanced OOP principles'},
                        {'title': 'Exception Handling', 'description': 'Managing errors in Python'}
                    ]
                }
            ],
            'videos': [
                {
                    'title': 'Python Installation and Setup',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 0
                },
                {
                    'title': 'Your First Python Program',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 1
                }
            ]
        },
        {
            'title': 'Machine Learning with Python',
            'description': 'Dive into the world of artificial intelligence and machine learning. Learn to build predictive models and analyze data.',
            'duration': '8 months',
            'level': 'Advanced',
            'price': 25000.00,
            'discount_price': 20000.00,
            'is_certified': True,
            'internship_duration': '6 months',
            'preview_duration': 360,
            'syllabus': [
                {
                    'title': 'Introduction to Machine Learning',
                    'order': 1,
                    'items': [
                        {'title': 'What is Machine Learning?', 'description': 'Understanding ML concepts and applications'},
                        {'title': 'Types of Machine Learning', 'description': 'Supervised, unsupervised, and reinforcement learning'},
                        {'title': 'Python Libraries for ML', 'description': 'NumPy, Pandas, Scikit-learn, and TensorFlow'}
                    ]
                },
                {
                    'title': 'Supervised Learning',
                    'order': 2,
                    'items': [
                        {'title': 'Linear and Logistic Regression', 'description': 'Building predictive models'},
                        {'title': 'Decision Trees and Random Forest', 'description': 'Tree-based algorithms'},
                        {'title': 'Support Vector Machines', 'description': 'Classification and regression with SVM'}
                    ]
                }
            ],
            'videos': [
                {
                    'title': 'Introduction to Machine Learning',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 0
                },
                {
                    'title': 'Setting up Python Environment',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 1
                }
            ]
        },
        {
            'title': 'Java Programming Fundamentals',
            'description': 'Master Java programming from basics to advanced concepts. Build enterprise-level applications.',
            'duration': '5 months',
            'level': 'Intermediate',
            'price': 12000.00,
            'discount_price': 9000.00,
            'is_certified': True,
            'internship_duration': '3 months',
            'preview_duration': 300,
            'syllabus': [
                {
                    'title': 'Java Basics',
                    'order': 1,
                    'items': [
                        {'title': 'Java Syntax and Structure', 'description': 'Understanding Java program structure'},
                        {'title': 'Variables and Data Types', 'description': 'Working with different data types in Java'},
                        {'title': 'Control Flow Statements', 'description': 'Loops, conditions, and decision making'}
                    ]
                }
            ],
            'videos': [
                {
                    'title': 'Java Development Environment Setup',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 0
                }
            ]
        },
        {
            'title': 'Cloud Computing with AWS',
            'description': 'Learn cloud computing concepts and master Amazon Web Services. Deploy scalable applications in the cloud.',
            'duration': '6 months',
            'level': 'Intermediate',
            'price': 18000.00,
            'discount_price': 15000.00,
            'is_certified': True,
            'internship_duration': '4 months',
            'preview_duration': 300,
            'syllabus': [
                {
                    'title': 'Cloud Computing Fundamentals',
                    'order': 1,
                    'items': [
                        {'title': 'Introduction to Cloud Computing', 'description': 'Understanding cloud service models'},
                        {'title': 'AWS Core Services', 'description': 'EC2, S3, RDS, and other essential services'},
                        {'title': 'AWS Security and IAM', 'description': 'Managing access and security in AWS'}
                    ]
                }
            ],
            'videos': [
                {
                    'title': 'Introduction to AWS',
                    'url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'source_type': 'youtube',
                    'order': 0
                }
            ]
        }
    ]
    
    print("Creating sample courses...")
    
    for course_data in courses_data:
        # Check if course already exists
        if Course.objects.filter(title=course_data['title']).exists():
            print(f"Course '{course_data['title']}' already exists, skipping...")
            continue
            
        # Create course
        course = Course.objects.create(
            title=course_data['title'],
            description=course_data['description'],
            duration=course_data['duration'],
            level=course_data['level'],
            price=course_data['price'],
            discount_price=course_data.get('discount_price'),
            is_certified=course_data['is_certified'],
            internship_duration=course_data.get('internship_duration'),
            preview_duration=course_data.get('preview_duration', 300)
        )
        
        print(f"Created course: {course.title}")
        
        # Create syllabus modules
        for module_data in course_data.get('syllabus', []):
            module = CourseSyllabus.objects.create(
                course=course,
                title=module_data['title'],
                order=module_data['order']
            )
            
            # Create syllabus items
            for item_data in module_data.get('items', []):
                SyllabusItem.objects.create(
                    module=module,
                    title=item_data['title'],
                    description=item_data.get('description', ''),
                    order=len(module.items.all())
                )
        
        # Create videos
        for video_data in course_data.get('videos', []):
            Video.objects.create(
                course=course,
                title=video_data['title'],
                url=video_data['url'],
                source_type=video_data['source_type'],
                order=video_data['order']
            )
    
    print(f"Sample courses created successfully!")
    print(f"Total courses in database: {Course.objects.count()}")

if __name__ == '__main__':
    create_sample_courses()