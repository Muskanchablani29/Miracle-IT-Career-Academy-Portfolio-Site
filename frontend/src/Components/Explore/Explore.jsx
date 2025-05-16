import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Certificates from './Certificates';
import Workshops from './Workshops';
import Quizzes from './Quizzes';
import CourseDetail from './CourseDetail';
import CoursesMain from './CoursesMain';
import './Explore.css';
import './course-container.css';
import { fetchCourses } from '../../api';

const Explore = () => {
  return (
    <div className="explore-container">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="explore-content">
        <Routes>
          <Route path="/" element={<CoursesList />} />
          <Route path="course/:courseId" element={<CourseDetail />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="workshops" element={<Workshops />} />
          <Route path="quizzes" element={<Quizzes />} />
          
          {/* All courses routes handled by CoursesMain component */}
          <Route path="courses/*" element={<CoursesMain />} />
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

export default Explore;