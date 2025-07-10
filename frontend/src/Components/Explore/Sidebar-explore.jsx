import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar-explore.css';
import { FaCertificate, FaChalkboardTeacher, FaQuestionCircle, FaCode, FaRobot, FaShieldAlt, FaBriefcase } from 'react-icons/fa';
import { fetchCourses } from '../../api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Add animation order to menu items
    if (sidebarRef.current) {
      const menuItems = sidebarRef.current.querySelectorAll('.sidebar-menu li, .category-menu li');
      menuItems.forEach((item, index) => {
        item.style.setProperty('--animation-order', index);
      });
    }
  }, []);
  
  useEffect(() => {
    // Fetch courses from backend
    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await fetchCourses();
        console.log('Loaded courses:', coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);
  
  // Function to handle course click
  const handleCourseClick = (courseId, courseName) => {
    console.log(`Navigating to course: ${courseName} (ID: ${courseId})`);
    console.log('Current location:', location.pathname);
    navigate(`/course/${courseId}`);
  };
  
  // Function to get course by name pattern
  const getCourseByPattern = (pattern) => {
    console.log(`Looking for course with pattern: ${pattern}`);
    console.log('Available courses:', courses.map(c => ({ id: c.id, title: c.title })));
    
    // First try exact title match
    let course = courses.find(course => 
      course.title.toLowerCase().includes(pattern.toLowerCase())
    );
    
    // If not found, try description match
    if (!course) {
      course = courses.find(course => 
        course.description.toLowerCase().includes(pattern.toLowerCase())
      );
    }
    
    // Special handling for MERN
    if (!course && pattern.toLowerCase() === 'mern') {
      course = courses.find(course => 
        course.title.toLowerCase().includes('mern') ||
        course.title.toLowerCase().includes('mongo') ||
        course.title.toLowerCase().includes('express') ||
        course.title.toLowerCase().includes('react') ||
        course.title.toLowerCase().includes('node') ||
        (course.title.toLowerCase().includes('full') && course.title.toLowerCase().includes('stack'))
      );
    }
    
    console.log(`Found course for pattern '${pattern}':`, course ? { id: course.id, title: course.title } : 'None');
    return course;
  };
  
  // Function to render course link
  const renderCourseLink = (pattern, fallbackPath, displayName) => {
    const course = getCourseByPattern(pattern);
    if (course) {
      const isActive = location.pathname === `/course/${course.id}` || location.pathname === `/explore/course/${course.id}`;
      return (
        <li className={isActive ? "active" : ""}>
          <button 
            onClick={() => handleCourseClick(course.id, course.title)}
            className="course-link-button"
            title={`View ${course.title}`}
          >
            {displayName}
            <span className="course-indicator">📚</span>
          </button>
        </li>
      );
    } else {
      return (
        <li className={location.pathname === fallbackPath ? "active" : ""}>
          <Link to={fallbackPath} title={`Explore ${displayName}`}>
            {displayName}
            <span className="fallback-indicator">🔗</span>
          </Link>
        </li>
      );
    }
  };
  
  return (
    <div className="sidebar-explore" ref={sidebarRef}>
      <h2>Explore</h2>
      {!loading && courses.length > 0 && (
        <div className="courses-count">
          <span className="count-badge">{courses.length} courses available</span>
        </div>
      )}
      <ul className="sidebar-menu-explore">
        <li className={location.pathname === "/explore/certificates" ? "active" : ""}>
          <Link to="/explore/certificates"><FaCertificate className="menu-icon" /> Earn a Certificate</Link>
        </li>
        <li className={location.pathname === "/explore/workshops" ? "active" : ""}>
          <Link to="/explore/workshops"><FaChalkboardTeacher className="menu-icon" /> Attend a Workshop</Link>
        </li>
        <li className={location.pathname === "/explore/quizzes" ? "active" : ""}>
          <Link to="/explore/quizzes"><FaQuestionCircle className="menu-icon" /> Take Quiz</Link>
        </li>
      </ul>
      
      <h3 className="category-heading"><FaCode className="heading-icon" /> Development Hub</h3>
      <ul className="category-menu">
        {loading ? (
          <li className="loading-item">Loading courses...</li>
        ) : (
          <>
            {renderCourseLink('mern', '/explore/courses/mern', 'MERN Stack')}
            {renderCourseLink('full stack', '/explore/courses/full-stack-web-development', 'Full Stack Web Development')}
            {renderCourseLink('data structure', '/explore/courses/c-cpp-data-structure', 'C/C++/Data Structure')}
            {renderCourseLink('java', '/explore/courses/java', 'Java Programming')}
            {renderCourseLink('python', '/explore/courses/python', 'Python Programming')}
            {renderCourseLink('php', '/explore/courses/php', 'PHP Development')}
          </>
        )}
      </ul>
      
      <h3 className="category-heading"><FaRobot className="heading-icon" /> AI and ML Track</h3>
      <ul className="category-menu">
        {loading ? (
          <li className="loading-item">Loading courses...</li>
        ) : (
          <>
            {renderCourseLink('artificial intelligence', '/explore/courses/artificial-intelligence', 'Artificial Intelligence')}
            {renderCourseLink('machine learning', '/explore/courses/machine-learning', 'Machine Learning')}
            {renderCourseLink('big data', '/explore/courses/big-data', 'Big Data Analytics')}
            {renderCourseLink('data science', '/explore/courses/data-science', 'Data Science & Analytics')}
          </>
        )}
      </ul>
      
      <h3 className="category-heading"><FaShieldAlt className="heading-icon" /> Cloud Security</h3>
      <ul className="category-menu">
        {loading ? (
          <li className="loading-item">Loading courses...</li>
        ) : (
          <>
            {renderCourseLink('security', '/explore/courses/it-security', 'IT Security & Ethical Hacking')}
            {renderCourseLink('cloud computing', '/explore/courses/cloud-computing', 'Cloud Computing')}
            {renderCourseLink('devops', '/explore/courses/devops', 'DevOps Engineering')}
            {renderCourseLink('aws', '/explore/courses/aws-azure', 'AWS/Azure Cloud')}
          </>
        )}
      </ul>
      
      <h3 className="category-heading"><FaBriefcase className="heading-icon" /> JOB Linked Program</h3>
      <ul className="category-menu">
        {loading ? (
          <li className="loading-item">Loading courses...</li>
        ) : (
          <>
            {renderCourseLink('pgdse', '/explore/courses/pgdse', 'PGDSE - Software Engineering')}
            {renderCourseLink('pgdie', '/explore/courses/pgdie', 'PGDIE - Industrial Engineering')}
            {renderCourseLink('pgdfe', '/explore/courses/pgdfe', 'PGDFE - Frontend Engineering')}
            {renderCourseLink('pgdda', '/explore/courses/pgdda', 'PGDDA - Data Analytics')}
            {renderCourseLink('aiml', '/explore/courses/aiml-advance-diploma', 'AIML Advanced Diploma')}
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;