#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, CourseSyllabus, SyllabusItem

def create_comprehensive_syllabus():
    """Create comprehensive syllabus for all courses with 5+ modules each"""
    
    # Define comprehensive syllabus templates for different course types
    syllabus_templates = {
        'web_development': [
            {
                'title': 'HTML & CSS Fundamentals',
                'items': [
                    {'title': 'HTML5 Structure and Semantics', 'description': 'Learn modern HTML5 elements and semantic markup'},
                    {'title': 'CSS3 Styling and Layout', 'description': 'Master CSS3 properties, flexbox, and grid systems'},
                    {'title': 'Responsive Web Design', 'description': 'Create mobile-first responsive layouts'},
                    {'title': 'CSS Animations and Transitions', 'description': 'Add interactive animations to web pages'},
                    {'title': 'Web Accessibility Standards', 'description': 'Implement WCAG guidelines for accessible web design'}
                ]
            },
            {
                'title': 'JavaScript Programming',
                'items': [
                    {'title': 'JavaScript Fundamentals', 'description': 'Variables, functions, and control structures'},
                    {'title': 'DOM Manipulation', 'description': 'Interact with HTML elements using JavaScript'},
                    {'title': 'Event Handling', 'description': 'Handle user interactions and browser events'},
                    {'title': 'Asynchronous JavaScript', 'description': 'Promises, async/await, and AJAX requests'},
                    {'title': 'ES6+ Modern Features', 'description': 'Arrow functions, destructuring, modules, and more'}
                ]
            },
            {
                'title': 'Frontend Frameworks',
                'items': [
                    {'title': 'React.js Fundamentals', 'description': 'Components, JSX, and virtual DOM concepts'},
                    {'title': 'State Management', 'description': 'useState, useEffect, and Context API'},
                    {'title': 'React Router', 'description': 'Client-side routing and navigation'},
                    {'title': 'Component Libraries', 'description': 'Material-UI, Bootstrap, and custom components'},
                    {'title': 'Testing React Applications', 'description': 'Jest, React Testing Library, and unit tests'}
                ]
            },
            {
                'title': 'Backend Development',
                'items': [
                    {'title': 'Node.js and Express.js', 'description': 'Server-side JavaScript development'},
                    {'title': 'RESTful API Design', 'description': 'Create scalable REST APIs with proper HTTP methods'},
                    {'title': 'Database Integration', 'description': 'MongoDB, MySQL, and database operations'},
                    {'title': 'Authentication & Authorization', 'description': 'JWT tokens, OAuth, and security best practices'},
                    {'title': 'API Documentation', 'description': 'Swagger/OpenAPI documentation and testing'}
                ]
            },
            {
                'title': 'DevOps and Deployment',
                'items': [
                    {'title': 'Version Control with Git', 'description': 'Git workflows, branching, and collaboration'},
                    {'title': 'Cloud Deployment', 'description': 'Deploy applications on AWS, Heroku, and Netlify'},
                    {'title': 'Containerization', 'description': 'Docker containers and container orchestration'},
                    {'title': 'CI/CD Pipelines', 'description': 'Automated testing and deployment workflows'},
                    {'title': 'Performance Optimization', 'description': 'Code splitting, lazy loading, and caching strategies'}
                ]
            },
            {
                'title': 'Project Development',
                'items': [
                    {'title': 'Project Planning', 'description': 'Requirements analysis and project architecture'},
                    {'title': 'Full-Stack Application', 'description': 'Build a complete web application from scratch'},
                    {'title': 'Code Review and Best Practices', 'description': 'Clean code principles and peer reviews'},
                    {'title': 'Portfolio Development', 'description': 'Create a professional developer portfolio'},
                    {'title': 'Job Interview Preparation', 'description': 'Technical interviews and coding challenges'}
                ]
            }
        ],
        'data_science': [
            {
                'title': 'Python Programming for Data Science',
                'items': [
                    {'title': 'Python Fundamentals', 'description': 'Variables, data types, and control structures'},
                    {'title': 'NumPy for Numerical Computing', 'description': 'Array operations and mathematical functions'},
                    {'title': 'Pandas for Data Manipulation', 'description': 'DataFrames, data cleaning, and transformation'},
                    {'title': 'Matplotlib and Seaborn', 'description': 'Data visualization and statistical plots'},
                    {'title': 'Jupyter Notebooks', 'description': 'Interactive development environment for data science'}
                ]
            },
            {
                'title': 'Statistics and Mathematics',
                'items': [
                    {'title': 'Descriptive Statistics', 'description': 'Mean, median, mode, and data distribution'},
                    {'title': 'Probability Theory', 'description': 'Probability distributions and Bayes theorem'},
                    {'title': 'Inferential Statistics', 'description': 'Hypothesis testing and confidence intervals'},
                    {'title': 'Linear Algebra', 'description': 'Vectors, matrices, and eigenvalues'},
                    {'title': 'Calculus for ML', 'description': 'Derivatives and optimization techniques'}
                ]
            },
            {
                'title': 'Machine Learning Fundamentals',
                'items': [
                    {'title': 'Supervised Learning', 'description': 'Regression and classification algorithms'},
                    {'title': 'Unsupervised Learning', 'description': 'Clustering and dimensionality reduction'},
                    {'title': 'Model Evaluation', 'description': 'Cross-validation and performance metrics'},
                    {'title': 'Feature Engineering', 'description': 'Feature selection and transformation techniques'},
                    {'title': 'Scikit-learn Library', 'description': 'Practical ML implementation with Python'}
                ]
            },
            {
                'title': 'Deep Learning',
                'items': [
                    {'title': 'Neural Network Basics', 'description': 'Perceptrons and multi-layer networks'},
                    {'title': 'TensorFlow and Keras', 'description': 'Deep learning frameworks and model building'},
                    {'title': 'Convolutional Neural Networks', 'description': 'Image recognition and computer vision'},
                    {'title': 'Recurrent Neural Networks', 'description': 'Sequential data and natural language processing'},
                    {'title': 'Transfer Learning', 'description': 'Pre-trained models and fine-tuning techniques'}
                ]
            },
            {
                'title': 'Data Engineering',
                'items': [
                    {'title': 'SQL and Database Design', 'description': 'Relational databases and query optimization'},
                    {'title': 'Big Data Technologies', 'description': 'Hadoop, Spark, and distributed computing'},
                    {'title': 'Data Pipelines', 'description': 'ETL processes and workflow automation'},
                    {'title': 'Cloud Data Platforms', 'description': 'AWS, GCP, and Azure data services'},
                    {'title': 'Data Warehousing', 'description': 'Data modeling and warehouse architecture'}
                ]
            },
            {
                'title': 'Capstone Projects',
                'items': [
                    {'title': 'End-to-End ML Project', 'description': 'Complete machine learning project lifecycle'},
                    {'title': 'Data Visualization Dashboard', 'description': 'Interactive dashboards with Plotly/Dash'},
                    {'title': 'NLP Text Analysis', 'description': 'Sentiment analysis and text classification'},
                    {'title': 'Computer Vision Application', 'description': 'Image processing and object detection'},
                    {'title': 'Portfolio and Presentation', 'description': 'Professional portfolio and project presentation'}
                ]
            }
        ],
        'ai_ml': [
            {
                'title': 'Artificial Intelligence Foundations',
                'items': [
                    {'title': 'History and Evolution of AI', 'description': 'From Turing test to modern AI applications'},
                    {'title': 'AI Problem Solving', 'description': 'Search algorithms and optimization techniques'},
                    {'title': 'Knowledge Representation', 'description': 'Logic, semantic networks, and ontologies'},
                    {'title': 'Expert Systems', 'description': 'Rule-based systems and inference engines'},
                    {'title': 'AI Ethics and Bias', 'description': 'Responsible AI development and fairness'}
                ]
            },
            {
                'title': 'Machine Learning Algorithms',
                'items': [
                    {'title': 'Linear and Logistic Regression', 'description': 'Fundamental regression techniques'},
                    {'title': 'Decision Trees and Random Forest', 'description': 'Tree-based learning algorithms'},
                    {'title': 'Support Vector Machines', 'description': 'SVM for classification and regression'},
                    {'title': 'Ensemble Methods', 'description': 'Bagging, boosting, and stacking techniques'},
                    {'title': 'Clustering Algorithms', 'description': 'K-means, hierarchical, and DBSCAN clustering'}
                ]
            },
            {
                'title': 'Deep Learning and Neural Networks',
                'items': [
                    {'title': 'Artificial Neural Networks', 'description': 'Perceptrons and backpropagation algorithm'},
                    {'title': 'Deep Neural Networks', 'description': 'Multi-layer networks and activation functions'},
                    {'title': 'Convolutional Neural Networks', 'description': 'CNN architecture for image processing'},
                    {'title': 'Recurrent Neural Networks', 'description': 'LSTM and GRU for sequence modeling'},
                    {'title': 'Generative Adversarial Networks', 'description': 'GANs for data generation and synthesis'}
                ]
            },
            {
                'title': 'Natural Language Processing',
                'items': [
                    {'title': 'Text Preprocessing', 'description': 'Tokenization, stemming, and lemmatization'},
                    {'title': 'Language Models', 'description': 'N-grams and statistical language modeling'},
                    {'title': 'Word Embeddings', 'description': 'Word2Vec, GloVe, and contextual embeddings'},
                    {'title': 'Transformer Architecture', 'description': 'Attention mechanisms and BERT models'},
                    {'title': 'NLP Applications', 'description': 'Chatbots, translation, and text summarization'}
                ]
            },
            {
                'title': 'Computer Vision',
                'items': [
                    {'title': 'Image Processing Fundamentals', 'description': 'Filters, edge detection, and morphology'},
                    {'title': 'Feature Detection', 'description': 'SIFT, SURF, and corner detection algorithms'},
                    {'title': 'Object Detection', 'description': 'YOLO, R-CNN, and real-time detection systems'},
                    {'title': 'Image Segmentation', 'description': 'Semantic and instance segmentation techniques'},
                    {'title': 'Face Recognition', 'description': 'Facial landmark detection and recognition systems'}
                ]
            },
            {
                'title': 'AI Applications and Projects',
                'items': [
                    {'title': 'Recommendation Systems', 'description': 'Collaborative and content-based filtering'},
                    {'title': 'Autonomous Systems', 'description': 'Robotics and self-driving car algorithms'},
                    {'title': 'Game AI', 'description': 'Minimax, Monte Carlo tree search, and reinforcement learning'},
                    {'title': 'AI in Healthcare', 'description': 'Medical image analysis and diagnostic systems'},
                    {'title': 'Industry Capstone Project', 'description': 'Real-world AI solution development'}
                ]
            }
        ],
        'cloud_computing': [
            {
                'title': 'Cloud Computing Fundamentals',
                'items': [
                    {'title': 'Introduction to Cloud Computing', 'description': 'Cloud models: IaaS, PaaS, SaaS'},
                    {'title': 'Cloud Service Providers', 'description': 'AWS, Azure, GCP comparison and selection'},
                    {'title': 'Cloud Architecture Patterns', 'description': 'Scalability, reliability, and security patterns'},
                    {'title': 'Virtualization Technologies', 'description': 'VMs, containers, and serverless computing'},
                    {'title': 'Cloud Economics', 'description': 'Cost optimization and pricing models'}
                ]
            },
            {
                'title': 'Amazon Web Services (AWS)',
                'items': [
                    {'title': 'AWS Core Services', 'description': 'EC2, S3, VPC, and IAM fundamentals'},
                    {'title': 'AWS Compute Services', 'description': 'Lambda, ECS, EKS, and Elastic Beanstalk'},
                    {'title': 'AWS Storage and Database', 'description': 'RDS, DynamoDB, ElastiCache, and data lakes'},
                    {'title': 'AWS Networking', 'description': 'Load balancers, API Gateway, and CDN'},
                    {'title': 'AWS Security', 'description': 'Security groups, encryption, and compliance'}
                ]
            },
            {
                'title': 'DevOps and Infrastructure',
                'items': [
                    {'title': 'Infrastructure as Code', 'description': 'Terraform, CloudFormation, and ARM templates'},
                    {'title': 'CI/CD Pipelines', 'description': 'Jenkins, GitLab CI, and AWS CodePipeline'},
                    {'title': 'Container Orchestration', 'description': 'Kubernetes, Docker Swarm, and service mesh'},
                    {'title': 'Monitoring and Logging', 'description': 'CloudWatch, ELK stack, and observability'},
                    {'title': 'Configuration Management', 'description': 'Ansible, Chef, and Puppet automation'}
                ]
            },
            {
                'title': 'Cloud Security',
                'items': [
                    {'title': 'Identity and Access Management', 'description': 'RBAC, ABAC, and zero-trust architecture'},
                    {'title': 'Data Protection', 'description': 'Encryption, key management, and data governance'},
                    {'title': 'Network Security', 'description': 'Firewalls, VPNs, and network segmentation'},
                    {'title': 'Compliance and Governance', 'description': 'GDPR, HIPAA, and security frameworks'},
                    {'title': 'Incident Response', 'description': 'Security monitoring and threat detection'}
                ]
            },
            {
                'title': 'Microservices and APIs',
                'items': [
                    {'title': 'Microservices Architecture', 'description': 'Service decomposition and design patterns'},
                    {'title': 'API Design and Management', 'description': 'REST, GraphQL, and API gateways'},
                    {'title': 'Service Communication', 'description': 'Message queues, event streaming, and RPC'},
                    {'title': 'Data Management', 'description': 'Database per service and data consistency'},
                    {'title': 'Testing Strategies', 'description': 'Contract testing and service virtualization'}
                ]
            },
            {
                'title': 'Cloud Migration and Optimization',
                'items': [
                    {'title': 'Migration Strategies', 'description': '6 Rs of migration and assessment tools'},
                    {'title': 'Application Modernization', 'description': 'Refactoring and cloud-native development'},
                    {'title': 'Performance Optimization', 'description': 'Auto-scaling, caching, and load balancing'},
                    {'title': 'Cost Management', 'description': 'Resource optimization and billing analysis'},
                    {'title': 'Disaster Recovery', 'description': 'Backup strategies and business continuity'}
                ]
            }
        ],
        'default': [
            {
                'title': 'Course Introduction and Fundamentals',
                'items': [
                    {'title': 'Course Overview', 'description': 'Introduction to course objectives and learning outcomes'},
                    {'title': 'Basic Concepts', 'description': 'Fundamental concepts and terminology'},
                    {'title': 'Industry Context', 'description': 'Current industry trends and applications'},
                    {'title': 'Tools and Environment Setup', 'description': 'Development environment and required tools'},
                    {'title': 'Getting Started', 'description': 'First hands-on exercises and examples'}
                ]
            },
            {
                'title': 'Core Concepts and Theory',
                'items': [
                    {'title': 'Theoretical Foundation', 'description': 'Core theoretical concepts and principles'},
                    {'title': 'Key Algorithms', 'description': 'Important algorithms and their applications'},
                    {'title': 'Data Structures', 'description': 'Essential data structures and their usage'},
                    {'title': 'Design Patterns', 'description': 'Common design patterns and best practices'},
                    {'title': 'Problem-Solving Techniques', 'description': 'Analytical and problem-solving approaches'}
                ]
            },
            {
                'title': 'Practical Implementation',
                'items': [
                    {'title': 'Hands-on Exercises', 'description': 'Practical coding exercises and implementations'},
                    {'title': 'Project Development', 'description': 'Building real-world applications'},
                    {'title': 'Testing and Debugging', 'description': 'Testing methodologies and debugging techniques'},
                    {'title': 'Code Optimization', 'description': 'Performance optimization and code quality'},
                    {'title': 'Documentation', 'description': 'Technical documentation and code comments'}
                ]
            },
            {
                'title': 'Advanced Topics',
                'items': [
                    {'title': 'Advanced Techniques', 'description': 'Complex implementations and advanced methods'},
                    {'title': 'Integration Patterns', 'description': 'System integration and API development'},
                    {'title': 'Security Considerations', 'description': 'Security best practices and implementation'},
                    {'title': 'Scalability', 'description': 'Building scalable and maintainable systems'},
                    {'title': 'Performance Tuning', 'description': 'Optimization techniques and performance analysis'}
                ]
            },
            {
                'title': 'Industry Applications',
                'items': [
                    {'title': 'Real-world Case Studies', 'description': 'Industry case studies and success stories'},
                    {'title': 'Current Technologies', 'description': 'Latest tools and technologies in the field'},
                    {'title': 'Market Trends', 'description': 'Industry trends and future directions'},
                    {'title': 'Professional Skills', 'description': 'Soft skills and professional development'},
                    {'title': 'Career Guidance', 'description': 'Career paths and job market insights'}
                ]
            },
            {
                'title': 'Capstone Project',
                'items': [
                    {'title': 'Project Planning', 'description': 'Project scope definition and planning'},
                    {'title': 'Implementation Phase', 'description': 'Full project development and implementation'},
                    {'title': 'Testing and Validation', 'description': 'Comprehensive testing and quality assurance'},
                    {'title': 'Deployment', 'description': 'Project deployment and production setup'},
                    {'title': 'Presentation and Review', 'description': 'Project presentation and peer review'}
                ]
            }
        ]
    }
    
    # Get all courses
    courses = Course.objects.all()
    
    for course in courses:
        print(f"Creating syllabus for: {course.title}")
        
        # Clear existing syllabus
        CourseSyllabus.objects.filter(course=course).delete()
        
        # Determine which template to use based on course title/description
        template_key = 'default'
        title_lower = course.title.lower()
        description_lower = course.description.lower()
        
        if any(keyword in title_lower or keyword in description_lower for keyword in ['web', 'full stack', 'react', 'javascript', 'html', 'css']):
            template_key = 'web_development'
        elif any(keyword in title_lower or keyword in description_lower for keyword in ['data science', 'machine learning', 'python', 'analytics']):
            template_key = 'data_science'
        elif any(keyword in title_lower or keyword in description_lower for keyword in ['artificial intelligence', 'ai', 'ml', 'deep learning', 'neural']):
            template_key = 'ai_ml'
        elif any(keyword in title_lower or keyword in description_lower for keyword in ['cloud', 'aws', 'azure', 'devops']):
            template_key = 'cloud_computing'
        
        template = syllabus_templates[template_key]
        
        # Create syllabus modules
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
        
        print(f"  -> Created {len(template)} modules with {sum(len(m['items']) for m in template)} items")
    
    print(f"\nSuccessfully created comprehensive syllabus for {courses.count()} courses!")

if __name__ == '__main__':
    create_comprehensive_syllabus()