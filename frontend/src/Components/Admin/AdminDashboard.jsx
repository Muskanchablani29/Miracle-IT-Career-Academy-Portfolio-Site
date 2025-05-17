import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="welcome-section">
        <h2>Welcome, {user?.username || 'Admin'}!</h2>
        <p>Manage users, courses, and system settings from this dashboard.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">245</p>
          <div className="stat-breakdown">
            <span>Students: 200</span>
            <span>Faculty: 35</span>
            <span>Admins: 10</span>
          </div>
        </div>
        <div className="stat-card">
          <h3>Active Courses</h3>
          <p className="stat-number">18</p>
        </div>
        <div className="stat-card">
          <h3>New Registrations</h3>
          <p className="stat-number">12</p>
          <p className="stat-period">This week</p>
        </div>
      </div>
      
      <div className="admin-panels">
        <div className="admin-panel">
          <h3>Recent Users</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>john_doe</td>
                <td>Student</td>
                <td>Oct 15, 2023</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>sarah_smith</td>
                <td>Faculty</td>
                <td>Oct 12, 2023</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>mike_johnson</td>
                <td>Student</td>
                <td>Oct 10, 2023</td>
                <td><span className="status inactive">Inactive</span></td>
              </tr>
            </tbody>
          </table>
          <button className="view-all-btn">View All Users</button>
        </div>
        
        <div className="admin-panel">
          <h3>System Notifications</h3>
          <ul className="notification-list">
            <li className="notification">
              <span className="notification-type error">Error</span>
              <p>Database backup failed on Oct 16, 2023</p>
            </li>
            <li className="notification">
              <span className="notification-type warning">Warning</span>
              <p>Server load reached 85% at 3:45 PM</p>
            </li>
            <li className="notification">
              <span className="notification-type info">Info</span>
              <p>System update scheduled for Oct 20, 2023</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}