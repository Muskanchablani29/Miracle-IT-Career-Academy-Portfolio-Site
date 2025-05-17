import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import './StudentDashboard.css'
import { FaSearch } from 'react-icons/fa'

export default function StudentDashboard() {
  const { user } = useContext(UserContext);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  
  const handleCourseSearch = (e) => {
    setCourseSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (courseSearchQuery.trim()) {
      console.log('Searching for courses:', courseSearchQuery);
      // Implement course search functionality
    }
  };
  
  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <div className="welcome-section">
        <h2>Welcome, {user?.username || 'Student'}!</h2>
        <p>Track your progress and access your courses from this dashboard.</p>
      </div>
      
      {/* Course search bar */}
      <div className="course-search-container">
        <form onSubmit={handleSearchSubmit}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for courses..."
            value={courseSearchQuery}
            onChange={handleCourseSearch}
          />
        </form>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Enrolled Courses</h3>
          <p className="stat-number">3</p>
        </div>
        <div className="stat-card">
          <h3>Completed Assignments</h3>
          <p className="stat-number">15</p>
        </div>
        <div className="stat-card">
          <h3>Overall Progress</h3>
          <p className="stat-number">68%</p>
        </div>
      </div>
      
      <div className="my-courses">
        <h3>My Courses</h3>
        <div className="course-list">
          <div className="course-card">
            <h4>Web Development Fundamentals</h4>
            <div className="progress-bar">
              <div className="progress" style={{width: '75%'}}></div>
            </div>
            <p className="progress-text">75% Complete</p>
            <button className="continue-btn">Continue</button>
          </div>
          
          <div className="course-card">
            <h4>Data Structures & Algorithms</h4>
            <div className="progress-bar">
              <div className="progress" style={{width: '45%'}}></div>
            </div>
            <p className="progress-text">45% Complete</p>
            <button className="continue-btn">Continue</button>
          </div>
          
          <div className="course-card">
            <h4>Machine Learning Basics</h4>
            <div className="progress-bar">
              <div className="progress" style={{width: '20%'}}></div>
            </div>
            <p className="progress-text">20% Complete</p>
            <button className="continue-btn">Continue</button>
          </div>
        </div>
      </div>
    </div>
  )
}