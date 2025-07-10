#!/usr/bin/env python
import os
import sys
import django
from decimal import Decimal

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, CourseSyllabus, SyllabusItem
from users.models import FeeStructure, FeeInstallment, CustomUser

def create_missing_courses():
    """Create missing courses for the explore sidebar"""
    
    # Get admin user for created_by field
    admin_user = CustomUser.objects.filter(is_staff=True).first()
    if not admin_user:
        print("No admin user found. Creating default admin...")
        admin_user = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123',
            role='admin'
        )
    
    # Define missing courses with their details
    missing_courses = [
        {
            'title': 'PHP Development',
            'description': 'Master PHP programming for web development. Learn PHP fundamentals, MySQL integration, Laravel framework, and build dynamic web applications with server-side scripting.',
            'duration': '4 Months',
            'level': 'Intermediate',
            'internship_duration': '2 Months',
            'is_certified': True,
            'price': Decimal('25000.00'),
            'discount_price': Decimal('20000.00'),
            'category': 'development'
        },
        {
            'title': 'Machine Learning',
            'description': 'Dive deep into Machine Learning algorithms and techniques. Learn supervised and unsupervised learning, neural networks, and practical ML implementation with Python.',
            'duration': '6 Months',
            'level': 'Advanced',
            'internship_duration': '3 Months',
            'is_certified': True,
            'price': Decimal('45000.00'),
            'discount_price': Decimal('35000.00'),
            'category': 'ai_ml'
        },
        {
            'title': 'IT Security & Ethical Hacking',
            'description': 'Learn cybersecurity fundamentals, ethical hacking techniques, penetration testing, and security best practices to protect digital assets and systems.',
            'duration': '5 Months',
            'level': 'Advanced',
            'internship_duration': '2 Months',
            'is_certified': True,
            'price': Decimal('40000.00'),
            'discount_price': Decimal('32000.00'),
            'category': 'security'
        },
        {
            'title': 'AWS/Azure Cloud',
            'description': 'Master cloud computing with AWS and Azure platforms. Learn cloud architecture, deployment, security, and become a certified cloud professional.',
            'duration': '4 Months',
            'level': 'Intermediate',
            'internship_duration': '2 Months',
            'is_certified': True,
            'price': Decimal('35000.00'),
            'discount_price': Decimal('28000.00'),
            'category': 'cloud'
        },
        {
            'title': 'PGDIE - Industrial Engineering',
            'description': 'Post Graduate Diploma in Industrial Engineering. Learn process optimization, quality management, lean manufacturing, and industrial automation.',
            'duration': '12 Months',
            'level': 'Advanced',
            'internship_duration': '6 Months',
            'is_certified': True,
            'price': Decimal('80000.00'),
            'discount_price': Decimal('65000.00'),
            'category': 'job_linked'
        },
        {
            'title': 'PGDDA - Data Analytics',
            'description': 'Post Graduate Diploma in Data Analytics. Master data analysis, visualization, statistical modeling, and business intelligence tools.',
            'duration': '12 Months',
            'level': 'Advanced',
            'internship_duration': '6 Months',
            'is_certified': True,
            'price': Decimal('75000.00'),
            'discount_price': Decimal('60000.00'),
            'category': 'job_linked'
        },
        {
            'title': 'AIML Advanced Diploma',
            'description': 'Advanced Diploma in Artificial Intelligence and Machine Learning. Comprehensive program covering deep learning, NLP, computer vision, and AI applications.',
            'duration': '18 Months',
            'level': 'Expert',
            'internship_duration': '6 Months',
            'is_certified': True,
            'price': Decimal('120000.00'),
            'discount_price': Decimal('95000.00'),
            'category': 'ai_ml'
        },
        {
            'title': 'Artificial Intelligence',
            'description': 'Comprehensive AI course covering machine learning, deep learning, natural language processing, computer vision, and AI ethics.',
            'duration': '8 Months',
            'level': 'Advanced',
            'internship_duration': '4 Months',
            'is_certified': True,
            'price': Decimal('55000.00'),
            'discount_price': Decimal('45000.00'),
            'category': 'ai_ml'
        },
        {
            'title': 'Big Data Analytics',
            'description': 'Learn big data technologies including Hadoop, Spark, NoSQL databases, and data processing frameworks for handling large-scale data.',
            'duration': '6 Months',
            'level': 'Advanced',
            'internship_duration': '3 Months',
            'is_certified': True,
            'price': Decimal('50000.00'),
            'discount_price': Decimal('40000.00'),
            'category': 'data_science'
        }
    ]
    
    # Syllabus templates for different categories
    syllabus_templates = {
        'development': [
            {
                'title': 'Programming Fundamentals',
                'items': [
                    {'title': 'Language Syntax and Structure', 'description': 'Master the core syntax and programming constructs'},
                    {'title': 'Object-Oriented Programming', 'description': 'Learn OOP principles and design patterns'},
                    {'title': 'Database Integration', 'description': 'Connect and interact with databases'},
                    {'title': 'Error Handling and Debugging', 'description': 'Implement robust error handling mechanisms'},
                    {'title': 'Code Optimization', 'description': 'Write efficient and optimized code'}
                ]
            },
            {
                'title': 'Web Development Essentials',
                'items': [
                    {'title': 'Frontend Integration', 'description': 'Connect backend with frontend technologies'},
                    {'title': 'API Development', 'description': 'Build RESTful APIs and web services'},
                    {'title': 'Session Management', 'description': 'Handle user sessions and authentication'},
                    {'title': 'Security Best Practices', 'description': 'Implement security measures and validation'},
                    {'title': 'Performance Optimization', 'description': 'Optimize web application performance'}
                ]
            },
            {
                'title': 'Framework Mastery',
                'items': [
                    {'title': 'Framework Architecture', 'description': 'Understand MVC and framework patterns'},
                    {'title': 'Routing and Controllers', 'description': 'Implement application routing and logic'},
                    {'title': 'Template Engines', 'description': 'Work with template systems and views'},
                    {'title': 'Middleware and Plugins', 'description': 'Extend functionality with middleware'},
                    {'title': 'Testing and Quality Assurance', 'description': 'Write tests and ensure code quality'}
                ]
            },
            {
                'title': 'Database Management',
                'items': [
                    {'title': 'Database Design', 'description': 'Design efficient database schemas'},
                    {'title': 'Query Optimization', 'description': 'Write optimized database queries'},
                    {'title': 'Data Migration', 'description': 'Handle database migrations and updates'},
                    {'title': 'Backup and Recovery', 'description': 'Implement data backup strategies'},
                    {'title': 'NoSQL Integration', 'description': 'Work with NoSQL databases'}
                ]
            },
            {
                'title': 'Deployment and DevOps',
                'items': [
                    {'title': 'Server Configuration', 'description': 'Configure web servers and hosting'},
                    {'title': 'Version Control', 'description': 'Master Git workflows and collaboration'},
                    {'title': 'CI/CD Pipelines', 'description': 'Implement continuous integration and deployment'},
                    {'title': 'Monitoring and Logging', 'description': 'Set up application monitoring'},
                    {'title': 'Performance Tuning', 'description': 'Optimize application performance'}
                ]
            },
            {
                'title': 'Real-World Projects',
                'items': [
                    {'title': 'E-commerce Platform', 'description': 'Build a complete e-commerce solution'},
                    {'title': 'Content Management System', 'description': 'Develop a custom CMS'},
                    {'title': 'API Integration Project', 'description': 'Integrate third-party APIs'},
                    {'title': 'Portfolio Development', 'description': 'Create professional portfolio'},
                    {'title': 'Industry Capstone', 'description': 'Complete industry-level project'}
                ]
            }
        ],
        'ai_ml': [
            {
                'title': 'AI/ML Foundations',
                'items': [
                    {'title': 'Mathematics for AI', 'description': 'Linear algebra, calculus, and statistics'},
                    {'title': 'Python for AI/ML', 'description': 'Python programming and scientific libraries'},
                    {'title': 'Data Preprocessing', 'description': 'Data cleaning and feature engineering'},
                    {'title': 'Exploratory Data Analysis', 'description': 'Data visualization and analysis techniques'},
                    {'title': 'ML Algorithm Fundamentals', 'description': 'Understanding core ML algorithms'}
                ]
            },
            {
                'title': 'Supervised Learning',
                'items': [
                    {'title': 'Regression Algorithms', 'description': 'Linear, polynomial, and advanced regression'},
                    {'title': 'Classification Techniques', 'description': 'Decision trees, SVM, and ensemble methods'},
                    {'title': 'Model Evaluation', 'description': 'Cross-validation and performance metrics'},
                    {'title': 'Feature Selection', 'description': 'Dimensionality reduction techniques'},
                    {'title': 'Hyperparameter Tuning', 'description': 'Optimization and model selection'}
                ]
            },
            {
                'title': 'Unsupervised Learning',
                'items': [
                    {'title': 'Clustering Algorithms', 'description': 'K-means, hierarchical, and density-based clustering'},
                    {'title': 'Association Rules', 'description': 'Market basket analysis and pattern mining'},
                    {'title': 'Dimensionality Reduction', 'description': 'PCA, t-SNE, and manifold learning'},
                    {'title': 'Anomaly Detection', 'description': 'Outlier detection and fraud analysis'},
                    {'title': 'Recommendation Systems', 'description': 'Collaborative and content-based filtering'}
                ]
            },
            {
                'title': 'Deep Learning',
                'items': [
                    {'title': 'Neural Network Fundamentals', 'description': 'Perceptrons and multi-layer networks'},
                    {'title': 'Convolutional Neural Networks', 'description': 'Image processing and computer vision'},
                    {'title': 'Recurrent Neural Networks', 'description': 'Sequential data and time series analysis'},
                    {'title': 'Transfer Learning', 'description': 'Pre-trained models and fine-tuning'},
                    {'title': 'Generative Models', 'description': 'GANs and variational autoencoders'}
                ]
            },
            {
                'title': 'Specialized Applications',
                'items': [
                    {'title': 'Natural Language Processing', 'description': 'Text analysis and language models'},
                    {'title': 'Computer Vision', 'description': 'Image recognition and object detection'},
                    {'title': 'Reinforcement Learning', 'description': 'Agent-based learning and game AI'},
                    {'title': 'Time Series Forecasting', 'description': 'Predictive modeling for temporal data'},
                    {'title': 'AI Ethics and Bias', 'description': 'Responsible AI development'}
                ]
            },
            {
                'title': 'Industry Projects',
                'items': [
                    {'title': 'Predictive Analytics Project', 'description': 'End-to-end ML pipeline development'},
                    {'title': 'Computer Vision Application', 'description': 'Image classification or object detection'},
                    {'title': 'NLP Text Analysis', 'description': 'Sentiment analysis or chatbot development'},
                    {'title': 'Recommendation Engine', 'description': 'Build personalized recommendation system'},
                    {'title': 'AI Product Development', 'description': 'Complete AI solution for industry problem'}
                ]
            }
        ],
        'security': [
            {
                'title': 'Cybersecurity Fundamentals',
                'items': [
                    {'title': 'Information Security Principles', 'description': 'CIA triad and security frameworks'},
                    {'title': 'Threat Landscape', 'description': 'Current cyber threats and attack vectors'},
                    {'title': 'Risk Assessment', 'description': 'Identifying and evaluating security risks'},
                    {'title': 'Security Policies', 'description': 'Developing organizational security policies'},
                    {'title': 'Compliance Standards', 'description': 'GDPR, HIPAA, and industry regulations'}
                ]
            },
            {
                'title': 'Network Security',
                'items': [
                    {'title': 'Network Protocols', 'description': 'TCP/IP, DNS, and network communication'},
                    {'title': 'Firewall Configuration', 'description': 'Network perimeter security'},
                    {'title': 'Intrusion Detection', 'description': 'IDS/IPS systems and monitoring'},
                    {'title': 'VPN and Encryption', 'description': 'Secure communication channels'},
                    {'title': 'Wireless Security', 'description': 'WiFi security and mobile device protection'}
                ]
            },
            {
                'title': 'Ethical Hacking',
                'items': [
                    {'title': 'Penetration Testing', 'description': 'Systematic security testing methodologies'},
                    {'title': 'Vulnerability Assessment', 'description': 'Identifying system weaknesses'},
                    {'title': 'Social Engineering', 'description': 'Human factor security testing'},
                    {'title': 'Web Application Security', 'description': 'OWASP top 10 and web vulnerabilities'},
                    {'title': 'Mobile Security Testing', 'description': 'iOS and Android security assessment'}
                ]
            },
            {
                'title': 'Digital Forensics',
                'items': [
                    {'title': 'Evidence Collection', 'description': 'Digital evidence handling procedures'},
                    {'title': 'File System Analysis', 'description': 'Analyzing digital storage systems'},
                    {'title': 'Network Forensics', 'description': 'Investigating network-based incidents'},
                    {'title': 'Malware Analysis', 'description': 'Reverse engineering malicious software'},
                    {'title': 'Incident Response', 'description': 'Security incident handling procedures'}
                ]
            },
            {
                'title': 'Security Tools and Technologies',
                'items': [
                    {'title': 'Security Scanning Tools', 'description': 'Nmap, Nessus, and vulnerability scanners'},
                    {'title': 'Penetration Testing Frameworks', 'description': 'Metasploit and exploitation frameworks'},
                    {'title': 'SIEM Systems', 'description': 'Security information and event management'},
                    {'title': 'Cryptography Implementation', 'description': 'Encryption algorithms and key management'},
                    {'title': 'Security Automation', 'description': 'Scripting and automated security testing'}
                ]
            },
            {
                'title': 'Practical Security Projects',
                'items': [
                    {'title': 'Penetration Testing Lab', 'description': 'Complete security assessment project'},
                    {'title': 'Security Policy Development', 'description': 'Create comprehensive security framework'},
                    {'title': 'Incident Response Simulation', 'description': 'Handle simulated security incidents'},
                    {'title': 'Vulnerability Management', 'description': 'Implement vulnerability management program'},
                    {'title': 'Security Awareness Program', 'description': 'Design employee security training'}
                ]
            }
        ],
        'cloud': [
            {
                'title': 'Cloud Computing Fundamentals',
                'items': [
                    {'title': 'Cloud Service Models', 'description': 'IaaS, PaaS, SaaS understanding'},
                    {'title': 'Cloud Deployment Models', 'description': 'Public, private, hybrid cloud strategies'},
                    {'title': 'Cloud Economics', 'description': 'Cost optimization and pricing models'},
                    {'title': 'Cloud Security Basics', 'description': 'Shared responsibility model'},
                    {'title': 'Migration Strategies', 'description': 'Cloud adoption and migration planning'}
                ]
            },
            {
                'title': 'AWS Core Services',
                'items': [
                    {'title': 'EC2 and Compute Services', 'description': 'Virtual machines and serverless computing'},
                    {'title': 'S3 and Storage Solutions', 'description': 'Object storage and data management'},
                    {'title': 'VPC and Networking', 'description': 'Virtual private cloud configuration'},
                    {'title': 'IAM and Security', 'description': 'Identity and access management'},
                    {'title': 'RDS and Database Services', 'description': 'Managed database solutions'}
                ]
            },
            {
                'title': 'Azure Platform Services',
                'items': [
                    {'title': 'Azure Virtual Machines', 'description': 'Compute resources and scaling'},
                    {'title': 'Azure Storage Solutions', 'description': 'Blob storage and data services'},
                    {'title': 'Azure Active Directory', 'description': 'Identity and access management'},
                    {'title': 'Azure Networking', 'description': 'Virtual networks and connectivity'},
                    {'title': 'Azure Database Services', 'description': 'SQL and NoSQL database options'}
                ]
            },
            {
                'title': 'DevOps and Automation',
                'items': [
                    {'title': 'Infrastructure as Code', 'description': 'Terraform and CloudFormation'},
                    {'title': 'CI/CD Pipelines', 'description': 'Automated deployment workflows'},
                    {'title': 'Container Services', 'description': 'Docker and Kubernetes orchestration'},
                    {'title': 'Monitoring and Logging', 'description': 'CloudWatch and Azure Monitor'},
                    {'title': 'Configuration Management', 'description': 'Ansible and Chef automation'}
                ]
            },
            {
                'title': 'Cloud Security and Compliance',
                'items': [
                    {'title': 'Cloud Security Architecture', 'description': 'Security design patterns'},
                    {'title': 'Data Protection', 'description': 'Encryption and key management'},
                    {'title': 'Compliance Frameworks', 'description': 'SOC, PCI DSS, and regulatory compliance'},
                    {'title': 'Security Monitoring', 'description': 'Threat detection and response'},
                    {'title': 'Disaster Recovery', 'description': 'Backup and business continuity'}
                ]
            },
            {
                'title': 'Cloud Projects and Certification',
                'items': [
                    {'title': 'Multi-tier Application Deployment', 'description': 'Deploy scalable web applications'},
                    {'title': 'Hybrid Cloud Integration', 'description': 'Connect on-premises with cloud'},
                    {'title': 'Serverless Application Development', 'description': 'Build event-driven applications'},
                    {'title': 'Cloud Migration Project', 'description': 'Migrate existing applications to cloud'},
                    {'title': 'Certification Preparation', 'description': 'AWS/Azure certification exam prep'}
                ]
            }
        ],
        'job_linked': [
            {
                'title': 'Industry Fundamentals',
                'items': [
                    {'title': 'Industry Overview', 'description': 'Current market trends and opportunities'},
                    {'title': 'Professional Skills', 'description': 'Communication and leadership skills'},
                    {'title': 'Project Management', 'description': 'Agile and traditional project management'},
                    {'title': 'Quality Assurance', 'description': 'Quality standards and best practices'},
                    {'title': 'Business Analysis', 'description': 'Requirements gathering and analysis'}
                ]
            },
            {
                'title': 'Technical Specialization',
                'items': [
                    {'title': 'Core Technologies', 'description': 'Master relevant technical skills'},
                    {'title': 'Advanced Concepts', 'description': 'Deep dive into specialized topics'},
                    {'title': 'Industry Tools', 'description': 'Professional software and platforms'},
                    {'title': 'Best Practices', 'description': 'Industry standards and methodologies'},
                    {'title': 'Innovation Trends', 'description': 'Emerging technologies and practices'}
                ]
            },
            {
                'title': 'Practical Application',
                'items': [
                    {'title': 'Case Studies', 'description': 'Real-world problem solving'},
                    {'title': 'Hands-on Projects', 'description': 'Industry-relevant project work'},
                    {'title': 'Simulation Exercises', 'description': 'Workplace scenario practice'},
                    {'title': 'Team Collaboration', 'description': 'Group projects and teamwork'},
                    {'title': 'Process Optimization', 'description': 'Efficiency improvement techniques'}
                ]
            },
            {
                'title': 'Industry Integration',
                'items': [
                    {'title': 'Industry Partnerships', 'description': 'Collaboration with industry experts'},
                    {'title': 'Guest Lectures', 'description': 'Sessions with industry professionals'},
                    {'title': 'Site Visits', 'description': 'Industrial facility tours and exposure'},
                    {'title': 'Mentorship Program', 'description': 'One-on-one industry mentoring'},
                    {'title': 'Networking Events', 'description': 'Professional networking opportunities'}
                ]
            },
            {
                'title': 'Career Preparation',
                'items': [
                    {'title': 'Resume Building', 'description': 'Professional resume and portfolio development'},
                    {'title': 'Interview Preparation', 'description': 'Technical and HR interview skills'},
                    {'title': 'Soft Skills Development', 'description': 'Communication and interpersonal skills'},
                    {'title': 'Industry Certifications', 'description': 'Relevant professional certifications'},
                    {'title': 'Job Search Strategy', 'description': 'Effective job hunting techniques'}
                ]
            },
            {
                'title': 'Capstone and Internship',
                'items': [
                    {'title': 'Capstone Project Planning', 'description': 'Major project scope and planning'},
                    {'title': 'Industry Problem Solving', 'description': 'Real industry challenge resolution'},
                    {'title': 'Internship Preparation', 'description': 'Pre-internship skill development'},
                    {'title': 'Professional Presentation', 'description': 'Project presentation and defense'},
                    {'title': 'Career Transition', 'description': 'Smooth transition to professional role'}
                ]
            }
        ],
        'data_science': [
            {
                'title': 'Data Science Foundations',
                'items': [
                    {'title': 'Statistics and Probability', 'description': 'Statistical analysis and probability theory'},
                    {'title': 'Python for Data Science', 'description': 'NumPy, Pandas, and data manipulation'},
                    {'title': 'Data Visualization', 'description': 'Matplotlib, Seaborn, and Plotly'},
                    {'title': 'SQL and Databases', 'description': 'Database querying and management'},
                    {'title': 'Data Collection Methods', 'description': 'Web scraping and API integration'}
                ]
            },
            {
                'title': 'Big Data Technologies',
                'items': [
                    {'title': 'Hadoop Ecosystem', 'description': 'HDFS, MapReduce, and Hadoop tools'},
                    {'title': 'Apache Spark', 'description': 'Distributed computing and Spark SQL'},
                    {'title': 'NoSQL Databases', 'description': 'MongoDB, Cassandra, and document stores'},
                    {'title': 'Data Streaming', 'description': 'Kafka and real-time data processing'},
                    {'title': 'Cloud Big Data', 'description': 'AWS EMR, Google BigQuery, Azure HDInsight'}
                ]
            },
            {
                'title': 'Advanced Analytics',
                'items': [
                    {'title': 'Machine Learning Integration', 'description': 'ML algorithms for big data'},
                    {'title': 'Deep Learning at Scale', 'description': 'Distributed deep learning frameworks'},
                    {'title': 'Time Series Analysis', 'description': 'Temporal data analysis and forecasting'},
                    {'title': 'Graph Analytics', 'description': 'Network analysis and graph databases'},
                    {'title': 'Text Mining', 'description': 'Natural language processing for big data'}
                ]
            },
            {
                'title': 'Data Engineering',
                'items': [
                    {'title': 'ETL Pipelines', 'description': 'Extract, transform, load processes'},
                    {'title': 'Data Warehousing', 'description': 'Data warehouse design and implementation'},
                    {'title': 'Data Quality', 'description': 'Data validation and cleansing techniques'},
                    {'title': 'Workflow Orchestration', 'description': 'Apache Airflow and job scheduling'},
                    {'title': 'Data Governance', 'description': 'Data management and compliance'}
                ]
            },
            {
                'title': 'Visualization and Reporting',
                'items': [
                    {'title': 'Business Intelligence Tools', 'description': 'Tableau, Power BI, and Looker'},
                    {'title': 'Dashboard Development', 'description': 'Interactive dashboard creation'},
                    {'title': 'Storytelling with Data', 'description': 'Effective data communication'},
                    {'title': 'Real-time Dashboards', 'description': 'Live data visualization systems'},
                    {'title': 'Executive Reporting', 'description': 'Strategic reporting and KPI tracking'}
                ]
            },
            {
                'title': 'Industry Applications',
                'items': [
                    {'title': 'Retail Analytics', 'description': 'Customer behavior and sales optimization'},
                    {'title': 'Financial Analytics', 'description': 'Risk analysis and fraud detection'},
                    {'title': 'Healthcare Analytics', 'description': 'Medical data analysis and insights'},
                    {'title': 'IoT Data Processing', 'description': 'Sensor data and edge computing'},
                    {'title': 'Social Media Analytics', 'description': 'Social network analysis and sentiment mining'}
                ]
            }
        ]
    }
    
    created_courses = 0
    
    for course_data in missing_courses:
        # Check if course already exists
        if Course.objects.filter(title=course_data['title']).exists():
            print(f"Course '{course_data['title']}' already exists, skipping...")
            continue
        
        print(f"Creating course: {course_data['title']}")
        
        # Create course
        course = Course.objects.create(
            title=course_data['title'],
            description=course_data['description'],
            duration=course_data['duration'],
            level=course_data['level'],
            internship_duration=course_data['internship_duration'],
            is_certified=course_data['is_certified'],
            price=course_data['price'],
            discount_price=course_data['discount_price']
        )
        
        # Create fee structure
        fee_structure = FeeStructure.objects.create(
            name=f"{course.title} - Fee Structure",
            course=course,
            registration_fee=course_data['price'] * Decimal('0.1'),  # 10% registration fee
            tuition_fee=course_data['discount_price'] - (course_data['price'] * Decimal('0.1')),
            total_amount=course_data['discount_price'],
            installments=3,
            created_by=admin_user
        )
        
        # Create installments
        installment_amount = fee_structure.tuition_fee / 3
        
        # First installment includes registration fee
        FeeInstallment.objects.create(
            fee_structure=fee_structure,
            amount=fee_structure.registration_fee + installment_amount,
            due_date='2024-01-15',
            sequence=1
        )
        
        # Remaining installments
        for i in range(2, 4):
            due_month = i + 1
            due_date = f'2024-0{due_month}-15' if due_month < 10 else f'2024-{due_month}-15'
            
            FeeInstallment.objects.create(
                fee_structure=fee_structure,
                amount=installment_amount,
                due_date=due_date,
                sequence=i
            )
        
        # Create syllabus
        category = course_data['category']
        template = syllabus_templates.get(category, syllabus_templates['development'])
        
        for order, module_data in enumerate(template):
            syllabus_module = CourseSyllabus.objects.create(
                course=course,
                title=module_data['title'],
                order=order + 1
            )
            
            # Create syllabus items for each module
            for item_order, item_data in enumerate(module_data['items']):
                SyllabusItem.objects.create(
                    module=syllabus_module,
                    title=item_data['title'],
                    description=item_data['description'],
                    order=item_order + 1
                )
        
        print(f"  -> Created course with {len(template)} modules and fee structure")
        created_courses += 1
    
    print(f"\nSuccessfully created {created_courses} new courses!")
    print("All courses from the explore sidebar are now available in the backend.")

if __name__ == '__main__':
    create_missing_courses()