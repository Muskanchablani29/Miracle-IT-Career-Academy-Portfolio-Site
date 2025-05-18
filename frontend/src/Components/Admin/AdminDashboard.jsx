import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard-content">
      <h1>Admin Dashboard</h1>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">1,245</p>
          <p className="stat-change positive">+12% from last month</p>
        </div>
        <div className="stat-card">
          <h3>Total Faculty</h3>
          <p className="stat-number">48</p>
          <p className="stat-change positive">+3% from last month</p>
        </div>
        <div className="stat-card">
          <h3>Active Courses</h3>
          <p className="stat-number">32</p>
          <p className="stat-change neutral">No change</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-number">₹24.5L</p>
          <p className="stat-change positive">+8% from last month</p>
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-column">
          <div className="dashboard-card">
            <h3>Recent Enrollments</h3>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rahul Sharma</td>
                  <td>Web Development</td>
                  <td>12 Jul, 2023</td>
                  <td className="status-success">Confirmed</td>
                </tr>
                <tr>
                  <td>Priya Singh</td>
                  <td>Data Science</td>
                  <td>10 Jul, 2023</td>
                  <td className="status-success">Confirmed</td>
                </tr>
                <tr>
                  <td>Amit Kumar</td>
                  <td>Python Programming</td>
                  <td>08 Jul, 2023</td>
                  <td className="status-pending">Pending</td>
                </tr>
              </tbody>
            </table>
            <a href="#" className="view-all">View All</a>
          </div>
        </div>
        
        <div className="dashboard-column">
          <div className="dashboard-card">
            <h3>System Notifications</h3>
            <div className="notification-list">
              <div className="notification">
                <div className="notification-icon warning">⚠️</div>
                <div className="notification-content">
                  <p className="notification-text">Server load high (85%)</p>
                  <p className="notification-time">2 hours ago</p>
                </div>
              </div>
              <div className="notification">
                <div className="notification-icon info">ℹ️</div>
                <div className="notification-content">
                  <p className="notification-text">Database backup completed</p>
                  <p className="notification-time">5 hours ago</p>
                </div>
              </div>
              <div className="notification">
                <div className="notification-icon success">✅</div>
                <div className="notification-content">
                  <p className="notification-text">System update successful</p>
                  <p className="notification-time">1 day ago</p>
                </div>
              </div>
            </div>
            <a href="#" className="view-all">View All</a>
          </div>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h3>Course Enrollment Statistics</h3>
        <div className="chart-container">
          {/* Chart would be implemented with a library like Chart.js */}
          <div className="mock-chart">
            <div className="chart-bar" style={{ height: '90%', backgroundColor: '#4CAF50' }}>Web Dev</div>
            <div className="chart-bar" style={{ height: '75%', backgroundColor: '#2196F3' }}>Python</div>
            <div className="chart-bar" style={{ height: '60%', backgroundColor: '#FFC107' }}>Data Science</div>
            <div className="chart-bar" style={{ height: '45%', backgroundColor: '#9C27B0' }}>AI/ML</div>
            <div className="chart-bar" style={{ height: '30%', backgroundColor: '#F44336' }}>Cloud</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;