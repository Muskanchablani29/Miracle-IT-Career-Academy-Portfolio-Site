import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import './StudentDashboard.css'

export default function StudentDashboard() {
  const { user } = useContext(UserContext);
  
  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <div className="welcome-section">
        <h2>Welcome, {user?.username || 'Student'}!</h2>
        <p>Track your progress and access your courses from this dashboard.</p>
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