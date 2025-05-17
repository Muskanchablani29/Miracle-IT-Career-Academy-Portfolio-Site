import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import './FacultyDashboard.css'

export default function FacultyDashboard() {
  const { user } = useContext(UserContext);
  
  return (
    <div className="faculty-dashboard">
      <h1>Faculty Dashboard</h1>
      <div className="welcome-section">
        <h2>Welcome, {user?.username || 'Faculty'}!</h2>
        <p>Manage your courses and student assignments from this dashboard.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Courses</h3>
          <p className="stat-number">5</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">120</p>
        </div>
        <div className="stat-card">
          <h3>Pending Assignments</h3>
          <p className="stat-number">12</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          <li>
            <span className="activity-time">Today, 10:30 AM</span>
            <span className="activity-text">New assignment submitted by John Doe</span>
          </li>
          <li>
            <span className="activity-time">Yesterday, 3:45 PM</span>
            <span className="activity-text">Course materials updated for "Advanced Web Development"</span>
          </li>
          <li>
            <span className="activity-time">Oct 15, 2:20 PM</span>
            <span className="activity-text">Feedback provided on Sarah's project</span>
          </li>
        </ul>
      </div>
    </div>
  )
}