import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Certificates from './Certificates';
import Workshops from './Workshops';
import Quizzes from './Quizzes';
import CourseDetail from './CourseDetail';
import './Explore.css';
import './course-container.css';
import { fetchCourses } from '../../api';
import ArtificialInteligence from './Courses/AI&MlTrack/ArtificialInteligence';
import MachineLearning from './Courses/AI&MlTrack/MachineLearning';

const Explore = () => {
  return (
    <div className="explore-container">
      <Sidebar />
      <div className="explore-content">
        <Routes>
          <Route path="/" element={<CoursesList />} />
          <Route path="course/:courseId" element={<CourseDetail />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="workshops" element={<Workshops />} />
          <Route path="quizzes" element={<Quizzes />} />
          
          {/* Development Hub Routes */}
          <Route path="courses/mern" element={<DevelopmentCourse category="MERN" />} />
          <Route path="courses/full-stack-web-development" element={<DevelopmentCourse category="Full Stack Web Development" />} />
          <Route path="courses/c-cpp-data-structure" element={<DevelopmentCourse category="C/C++/Data Structure" />} />
          <Route path="courses/java" element={<DevelopmentCourse category="Java" />} />
          <Route path="courses/python" element={<DevelopmentCourse category="Python" />} />
          <Route path="courses/php" element={<DevelopmentCourse category="PHP" />} />
          
          {/* AI and ML Track Routes */}
          <Route path="courses/artificial-intelligence" element={<ArtificialInteligence />} />
          <Route path="courses/machine-learning" element={<MachineLearning />} />
          <Route path="courses/big-data" element={<AICourse category="Big Data" />} />
          <Route path="courses/data-science" element={<AICourse category="Data Science and Data Analytics" />} />
          
          {/* Cloud Security Routes */}
          <Route path="courses/it-security" element={<CloudCourse category="IT Security and Ethical Hacking" />} />
          <Route path="courses/cloud-computing" element={<CloudCourse category="Cloud Computing" />} />
          <Route path="courses/devops" element={<CloudCourse category="DevOps" />} />
          <Route path="courses/aws-azure" element={<CloudCourse category="AWS/Azure" />} />
          
          {/* JOB Linked Program Routes */}
          <Route path="courses/pgdse" element={<JobCourse category="PGDSE" />} />
          <Route path="courses/pgdie" element={<JobCourse category="PGDIE" />} />
          <Route path="courses/pgdfe" element={<JobCourse category="PGDFE" />} />
          <Route path="courses/pgdda" element={<JobCourse category="PGDDA" />} />
          <Route path="courses/aiml-advance-diploma" element={<JobCourse category="AIML (Advance Diploma)" />} />
          
          {/* Catch-all for category courses */}
          <Route path="courses/:category" element={<CategoryCourses />} />
        </Routes>
      </div>
    </div>
  );
};

// Default component showing list of courses
const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
        console.error('Error fetching courses:', err);
      }
    };

    getCourses();
  }, []);

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="courses-list">
      <h2>Available Courses</h2>
      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-image">
                <img src={course.image} alt={course.title} />
              </div>
              <div className="course-details">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                </div>
                <Link to={`/explore/course/${course.id}`} className="enroll-btn">View Course</Link>
              </div>
            </div>
          ))
        ) : (
          <p>No courses available at the moment.</p>
        )}
      </div>
    </div>
  );
};

// Component to display courses by category
const CategoryCourses = () => {
  const location = useLocation();
  const category = location.pathname.split('/').pop();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCoursesByCategory = async () => {
      try {
        setLoading(true);
        // In a real app, you would filter courses by category
        const data = await fetchCourses();
        // Simulating category filtering
        const filteredCourses = data.filter(course => 
          course.category?.toLowerCase() === category.toLowerCase()
        );
        setCourses(filteredCourses);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
        console.error('Error fetching courses:', err);
      }
    };

    getCoursesByCategory();
  }, [category]);

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Format the category name for display
  const formatCategoryName = (cat) => {
    return cat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="courses-list">
      <h2>{formatCategoryName(category)} Courses</h2>
      <div className="courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-image">
                <img src={course.image} alt={course.title} />
              </div>
              <div className="course-details">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                </div>
                <Link to={`/explore/course/${course.id}`} className="enroll-btn">View Course</Link>
              </div>
            </div>
          ))
        ) : (
          <p>No courses available in this category at the moment.</p>
        )}
      </div>
    </div>
  );
};

// Generic course components for different categories
const DevelopmentCourse = ({ category }) => {
  return (
    <div className="course-container">
      <h1>{category}</h1>
      <p className="course-description">
        Explore our comprehensive {category} curriculum designed to help you master this technology.
      </p>
      
      <div className="course-grid">
        <div className="course-card">
          <h3>Introduction to {category}</h3>
          <p>Learn the fundamentals of {category} and build a strong foundation.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>Advanced {category}</h3>
          <p>Take your {category} skills to the next level with advanced concepts.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>{category} Projects</h3>
          <p>Apply your knowledge by building real-world projects.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

const AICourse = ({ category }) => {
  return (
    <div className="course-container">
      <h1>{category}</h1>
      <p className="course-description">
        Explore our comprehensive {category} curriculum designed for AI and data enthusiasts.
      </p>
      
      <div className="course-grid">
        <div className="course-card">
          <h3>Introduction to {category}</h3>
          <p>Learn the fundamentals of {category} and its applications.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>Advanced {category} Techniques</h3>
          <p>Master advanced techniques and methodologies in {category}.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>{category} in Practice</h3>
          <p>Apply your knowledge through hands-on projects and case studies.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

const CloudCourse = ({ category }) => {
  return (
    <div className="course-container">
      <h1>{category}</h1>
      <p className="course-description">
        Explore our comprehensive {category} curriculum designed for cloud and security professionals.
      </p>
      
      <div className="course-grid">
        <div className="course-card">
          <h3>Introduction to {category}</h3>
          <p>Learn the fundamentals of {category} and build a strong foundation.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>{category} Best Practices</h3>
          <p>Master industry best practices and standards in {category}.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>{category} Certification Prep</h3>
          <p>Prepare for industry-recognized certifications in {category}.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

const JobCourse = ({ category }) => {
  return (
    <div className="course-container">
      <h1>{category} Program</h1>
      <p className="course-description">
        Our job-linked {category} program is designed to prepare you for industry roles.
      </p>
      
      <div className="course-grid">
        <div className="course-card">
          <h3>{category} Curriculum</h3>
          <p>Comprehensive curriculum covering all aspects of the program.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>Industry Projects</h3>
          <p>Work on real-world projects from industry partners.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>Placement Assistance</h3>
          <p>Get placement support and career guidance from our experts.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

export default Explore;