import React from 'react';
import './StudentDashboard.css';

const StudentCourses = () => {
  return (
    <div className="dashboard-container">
      <h1>My Courses</h1>
      <div className="dashboard-content">
        <p>View and manage your enrolled courses here.</p>
        <div className="courses-list">
          <div className="course-card">
            <h3>Web Development</h3>
            <p>Learn HTML, CSS, JavaScript and more</p>
            <button className="btn-primary">View Course</button>
          </div>
          <div className="course-card">
            <h3>Python Programming</h3>
            <p>Master Python fundamentals and advanced concepts</p>
            <button className="btn-primary">View Course</button>
          </div>
          <div className="course-card">
            <h3>Data Science</h3>
            <p>Explore data analysis and visualization</p>
            <button className="btn-primary">View Course</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;