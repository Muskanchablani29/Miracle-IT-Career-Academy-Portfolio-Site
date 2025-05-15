import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Certificates from './Certificates';
import Workshops from './Workshops';
import Quizzes from './Quizzes';
import './Explore.css';

const Explore = () => {
  return (
    <div className="explore-container">
      <Sidebar />
      <div className="explore-content">
        <Routes>
          <Route path="/" element={<CoursesList />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Routes>
      </div>
    </div>
  );
};

// Default component showing list of courses
const CoursesList = () => {
  return (
    <div className="courses-list">
      <h2>Available Courses</h2>
      <div className="courses-grid">
        {courses.map((course) => (
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
              <button className="enroll-btn">Enroll Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sample course data
const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    image: "https://via.placeholder.com/300x200",
    duration: "8 weeks",
    level: "Beginner"
  },
  {
    id: 2,
    title: "React.js for Beginners",
    description: "Master the fundamentals of React.js",
    image: "https://via.placeholder.com/300x200",
    duration: "10 weeks",
    level: "Intermediate"
  },
  {
    id: 3,
    title: "Advanced Python Programming",
    description: "Take your Python skills to the next level",
    image: "https://via.placeholder.com/300x200",
    duration: "12 weeks",
    level: "Advanced"
  },
  {
    id: 4,
    title: "Data Science Essentials",
    description: "Introduction to data analysis and visualization",
    image: "https://via.placeholder.com/300x200",
    duration: "14 weeks",
    level: "Intermediate"
  }
];

export default Explore;