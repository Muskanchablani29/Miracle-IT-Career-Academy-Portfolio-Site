import React, { useState, useEffect } from 'react';
import CourseTemplate from '../../CourseTemplate';
import { FaReact, FaNodeJs, FaDatabase, FaServer } from 'react-icons/fa';
import { SiExpress, SiMongodb } from 'react-icons/si';
import { fetchCourseSyllabus } from '../../../../api';

const Mern = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the course ID for MERN
    // For now, we'll use a hardcoded course ID or create mock data
    const loadSyllabus = async () => {
      try {
        // Try to fetch from API first
        const courseId = 1; // Assuming MERN course has ID 1
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
      name: 'MongoDB',
      icon: <SiMongodb />,
      description: 'NoSQL database for modern applications'
    },
    {
      name: 'Express.js',
      icon: <SiExpress />,
      description: 'Web application framework for Node.js'
    },
    {
      name: 'React',
      icon: <FaReact />,
      description: 'JavaScript library for building user interfaces'
    },
    {
      name: 'Node.js',
      icon: <FaNodeJs />,
      description: 'JavaScript runtime built on Chromes V8 engine'
    },
    {
      name: 'RESTful APIs',
      icon: <FaServer />,
      description: 'Design and implement backend services'
    },
    {
      name: 'Database Design',
      icon: <FaDatabase />,
      description: 'Schema design and data modeling'
    }
  ];

  const learningOutcomes = [
    'Build full-stack web applications using the MERN stack',
    'Design and implement RESTful APIs with Express.js',
    'Create dynamic and responsive user interfaces with React',
    'Implement authentication and authorization using JWT',
    'Work with MongoDB for data storage and retrieval',
    'Deploy applications to cloud platforms like Heroku and Netlify',
    'Implement real-time features with Socket.io',
    'Develop a professional portfolio with real-world projects'
  ];

  return (
    <CourseTemplate
      title="MERN Stack Development"
      description="Master the complete MERN (MongoDB, Express, React, Node.js) stack and become a full-stack JavaScript developer. This comprehensive course covers everything from basics to advanced concepts with hands-on projects."
      duration="12 Weeks"
      internshipDuration="4 Weeks"
      isCertified={true}
      syllabus={loading ? [] : syllabus}
      technologies={technologies}
      learningOutcomes={learningOutcomes}
      placementAssistance={true}
      courseId={1} // Assuming MERN course has ID 1
    />
  );
};

// Mock syllabus data as fallback
const mockSyllabus = [
  {
    id: 1,
    title: 'Introduction to MERN Stack',
    order: 1,
    items: [
      { id: 1, title: 'Overview of full-stack development' },
      { id: 2, title: 'Understanding the MERN architecture' },
      { id: 3, title: 'Setting up development environment' },
      { id: 4, title: 'Introduction to JavaScript ES6+ features' },
      { id: 5, title: 'Version control with Git and GitHub' }
    ]
  },
  {
    id: 2,
    title: 'MongoDB & Database Design',
    order: 2,
    items: [
      { id: 6, title: 'NoSQL vs SQL databases' },
      { id: 7, title: 'MongoDB installation and setup' },
      { id: 8, title: 'CRUD operations in MongoDB' },
      { id: 9, title: 'Schema design and data modeling' },
      { id: 10, title: 'Indexing and performance optimization' },
      { id: 11, title: 'MongoDB Atlas cloud setup' }
    ]
  },
  {
    id: 3,
    title: 'Express.js & Backend Development',
    order: 3,
    items: [
      { id: 12, title: 'Introduction to Node.js and NPM' },
      { id: 13, title: 'Creating RESTful APIs with Express' },
      { id: 14, title: 'Middleware implementation' },
      { id: 15, title: 'Error handling and validation' },
      { id: 16, title: 'Authentication and authorization (JWT)' },
      { id: 17, title: 'API testing with Postman' }
    ]
  },
  {
    id: 4,
    title: 'React.js Frontend Development',
    order: 4,
    items: [
      { id: 18, title: 'React fundamentals and JSX' },
      { id: 19, title: 'Components, props, and state' },
      { id: 20, title: 'Hooks and functional components' },
      { id: 21, title: 'React Router for navigation' },
      { id: 22, title: 'State management with Context API and Redux' },
      { id: 23, title: 'Form handling and validation' },
      { id: 24, title: 'Styling in React (CSS modules, styled-components)' }
    ]
  },
  {
    id: 5,
    title: 'Full Stack Integration',
    order: 5,
    items: [
      { id: 25, title: 'Connecting React frontend with Express backend' },
      { id: 26, title: 'HTTP requests with Axios' },
      { id: 27, title: 'Handling API responses and errors' },
      { id: 28, title: 'Authentication flow implementation' },
      { id: 29, title: 'File uploads and image handling' },
      { id: 30, title: 'Real-time features with Socket.io' }
    ]
  },
  {
    id: 6,
    title: 'Deployment & DevOps',
    order: 6,
    items: [
      { id: 31, title: 'Environment configuration' },
      { id: 32, title: 'Building for production' },
      { id: 33, title: 'Deployment to Heroku, Netlify, and Vercel' },
      { id: 34, title: 'CI/CD pipelines' },
      { id: 35, title: 'Performance optimization' },
      { id: 36, title: 'Monitoring and logging' }
    ]
  },
  {
    id: 7,
    title: 'Capstone Project',
    order: 7,
    items: [
      { id: 37, title: 'Project planning and requirements gathering' },
      { id: 38, title: 'System design and architecture' },
      { id: 39, title: 'Implementation of full-stack features' },
      { id: 40, title: 'Testing and quality assurance' },
      { id: 41, title: 'Deployment and presentation' },
      { id: 42, title: 'Portfolio development' }
    ]
  }
];

export default Mern;