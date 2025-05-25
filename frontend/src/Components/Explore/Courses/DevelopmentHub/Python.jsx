import React, { useState, useEffect } from 'react';
import CourseTemplate from '../../CourseTemplate';
import { FaPython, FaDatabase, FaChartBar, FaRobot } from 'react-icons/fa';
import { SiDjango, SiFlask, SiPandas, SiNumpy, SiScikitlearn } from 'react-icons/si';
import { fetchCourseSyllabus } from '../../../../api';

const Python = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSyllabus = async () => {
      try {
        // Try to fetch from API first
        const courseId = 2; // Assuming Python course has ID 2
        const data = await fetchCourseSyllabus(courseId);
        if (data && data.length > 0) {
          setSyllabus(data);
        } else {
          // Fallback to mock data if API returns empty
          setSyllabus(mockSyllabus);
        }
      } catch (error) {
        console.error('Error loading syllabus:', error);
        // Fallback to mock data on error
        setSyllabus(mockSyllabus);
      } finally {
        setLoading(false);
      }
    };

    loadSyllabus();
  }, []);

  const technologies = [
    {
      name: 'Python',
      icon: <FaPython />,
      description: 'High-level programming language'
    },
    {
      name: 'Django',
      icon: <SiDjango />,
      description: 'High-level Python web framework'
    },
    {
      name: 'Flask',
      icon: <SiFlask />,
      description: 'Lightweight WSGI web application framework'
    },
    {
      name: 'Pandas',
      icon: <SiPandas />,
      description: 'Data analysis and manipulation tool'
    },
    {
      name: 'NumPy',
      icon: <SiNumpy />,
      description: 'Library for numerical computations'
    },
    {
      name: 'Scikit-learn',
      icon: <SiScikitlearn />,
      description: 'Machine learning library'
    },
    {
      name: 'SQL',
      icon: <FaDatabase />,
      description: 'Database query language'
    },
    {
      name: 'Data Visualization',
      icon: <FaChartBar />,
      description: 'Creating visual representations of data'
    }
  ];

  const learningOutcomes = [
    'Master Python programming fundamentals and advanced concepts',
    'Build web applications using Django and Flask frameworks',
    'Perform data analysis and visualization with Pandas and Matplotlib',
    'Implement machine learning algorithms with Scikit-learn',
    'Work with databases using SQL and ORM tools',
    'Develop automation scripts and tools',
    'Create APIs and integrate with third-party services',
    'Apply Python for data science and artificial intelligence tasks'
  ];

  return (
    <CourseTemplate
      title="Python Programming & Applications"
      description="Become a proficient Python developer with this comprehensive course covering everything from core programming concepts to advanced applications in web development, data science, and automation."
      duration="10 Weeks"
      internshipDuration="3 Weeks"
      isCertified={true}
      syllabus={loading ? [] : syllabus}
      technologies={technologies}
      learningOutcomes={learningOutcomes}
      placementAssistance={true}
      courseId={2} // Assuming Python course has ID 2
    />
  );
};

// Mock syllabus data as fallback
const mockSyllabus = [
  {
    id: 1,
    title: 'Python Fundamentals',
    order: 1,
    items: [
      { id: 1, title: 'Introduction to Python and setup' },
      { id: 2, title: 'Variables, data types, and operators' },
      { id: 3, title: 'Control flow: conditionals and loops' },
      { id: 4, title: 'Functions and modules' },
      { id: 5, title: 'Error handling and exceptions' }
    ]
  },
  {
    id: 2,
    title: 'Data Structures and OOP',
    order: 2,
    items: [
      { id: 6, title: 'Lists, tuples, and dictionaries' },
      { id: 7, title: 'Sets and collections' },
      { id: 8, title: 'Object-oriented programming concepts' },
      { id: 9, title: 'Classes, objects, inheritance' },
      { id: 10, title: 'File handling and I/O operations' }
    ]
  },
  {
    id: 3,
    title: 'Web Development with Python',
    order: 3,
    items: [
      { id: 11, title: 'Introduction to Django framework' },
      { id: 12, title: 'Models, views, and templates' },
      { id: 13, title: 'Flask web framework' },
      { id: 14, title: 'RESTful API development' },
      { id: 15, title: 'Authentication and authorization' },
      { id: 16, title: 'Deployment and hosting' }
    ]
  },
  {
    id: 4,
    title: 'Database Integration',
    order: 4,
    items: [
      { id: 17, title: 'SQL fundamentals' },
      { id: 18, title: 'Working with SQLite and PostgreSQL' },
      { id: 19, title: 'ORM with SQLAlchemy and Django ORM' },
      { id: 20, title: 'Database design and optimization' },
      { id: 21, title: 'NoSQL databases with MongoDB and PyMongo' }
    ]
  },
  {
    id: 5,
    title: 'Data Analysis and Visualization',
    order: 5,
    items: [
      { id: 22, title: 'Introduction to NumPy' },
      { id: 23, title: 'Data manipulation with Pandas' },
      { id: 24, title: 'Data visualization with Matplotlib and Seaborn' },
      { id: 25, title: 'Exploratory data analysis' },
      { id: 26, title: 'Working with APIs and web scraping' }
    ]
  },
  {
    id: 6,
    title: 'Machine Learning with Python',
    order: 6,
    items: [
      { id: 27, title: 'Introduction to machine learning' },
      { id: 28, title: 'Scikit-learn library' },
      { id: 29, title: 'Supervised learning algorithms' },
      { id: 30, title: 'Unsupervised learning' },
      { id: 31, title: 'Model evaluation and improvement' }
    ]
  },
  {
    id: 7,
    title: 'Python for Automation',
    order: 7,
    items: [
      { id: 32, title: 'Automating repetitive tasks' },
      { id: 33, title: 'Working with Excel and CSV files' },
      { id: 34, title: 'Email and messaging automation' },
      { id: 35, title: 'Web automation with Selenium' },
      { id: 36, title: 'Creating scheduled tasks and cron jobs' }
    ]
  },
  {
    id: 8,
    title: 'Final Project',
    order: 8,
    items: [
      { id: 37, title: 'Project planning and requirements' },
      { id: 38, title: 'Implementation and coding' },
      { id: 39, title: 'Testing and debugging' },
      { id: 40, title: 'Documentation and presentation' },
      { id: 41, title: 'Deployment and maintenance' }
    ]
  }
];

export default Python;