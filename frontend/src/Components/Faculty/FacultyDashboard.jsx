import React from 'react';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Faculty Dashboard</h1>
      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card">
            <h3>My Courses</h3>
            <p className="stat-number">5</p>
            <p className="stat-change">Active courses</p>
          </div>
          <div className="stat-card">
            <h3>Total Students</h3>
            <p className="stat-number">165</p>
            <p className="stat-change">Across all courses</p>
          </div>
          <div className="stat-card">
            <h3>Assignments</h3>
            <p className="stat-number">12</p>
            <p className="stat-change">8 pending review</p>
          </div>
          <div className="stat-card">
            <h3>Average Attendance</h3>
            <p className="stat-number">85%</p>
            <p className="stat-change positive">+3% from last month</p>
          </div>
        </div>
        
        <div className="dashboard-row">
          <div className="dashboard-column">
            <div className="dashboard-card">
              <h3>Upcoming Classes</h3>
              <div className="class-list">
                <div className="class-item">
                  <div className="class-time">
                    <p className="day">Today</p>
                    <p className="time">10:00 AM</p>
                  </div>
                  <div className="class-info">
                    <h4>Web Development</h4>
                    <p>Introduction to React</p>
                    <p className="class-students">45 students</p>
                  </div>
                  <button className="btn-primary">Start Class</button>
                </div>
                <div className="class-item">
                  <div className="class-time">
                    <p className="day">Today</p>
                    <p className="time">02:00 PM</p>
                  </div>
                  <div className="class-info">
                    <h4>Python Programming</h4>
                    <p>Advanced Functions</p>
                    <p className="class-students">38 students</p>
                  </div>
                  <button className="btn-primary">Start Class</button>
                </div>
                <div className="class-item">
                  <div className="class-time">
                    <p className="day">Tomorrow</p>
                    <p className="time">11:00 AM</p>
                  </div>
                  <div className="class-info">
                    <h4>Data Science</h4>
                    <p>Data Visualization</p>
                    <p className="class-students">32 students</p>
                  </div>
                  <button className="btn-secondary">Prepare</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-column">
            <div className="dashboard-card">
              <h3>Recent Submissions</h3>
              <div className="submission-list">
                <div className="submission-item">
                  <div className="submission-info">
                    <h4>JavaScript Assignment</h4>
                    <p>Submitted by: Rahul Sharma</p>
                    <p className="submission-time">2 hours ago</p>
                  </div>
                  <button className="btn-secondary">Review</button>
                </div>
                <div className="submission-item">
                  <div className="submission-info">
                    <h4>Python Project</h4>
                    <p>Submitted by: Priya Singh</p>
                    <p className="submission-time">5 hours ago</p>
                  </div>
                  <button className="btn-secondary">Review</button>
                </div>
                <div className="submission-item">
                  <div className="submission-info">
                    <h4>Database Quiz</h4>
                    <p>Submitted by: Amit Kumar</p>
                    <p className="submission-time">1 day ago</p>
                  </div>
                  <button className="btn-secondary">Review</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Course Performance</h3>
          <div className="chart-container">
            {/* Chart would be implemented with a library like Chart.js */}
            <div className="mock-chart">
              <div className="chart-bar" style={{ height: '85%', backgroundColor: '#4CAF50' }}>Web Dev</div>
              <div className="chart-bar" style={{ height: '75%', backgroundColor: '#2196F3' }}>Python</div>
              <div className="chart-bar" style={{ height: '65%', backgroundColor: '#FFC107' }}>Data Science</div>
              <div className="chart-bar" style={{ height: '80%', backgroundColor: '#9C27B0' }}>AI/ML</div>
              <div className="chart-bar" style={{ height: '70%', backgroundColor: '#F44336' }}>Cloud</div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
              <span>Average Grade</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#2196F3' }}></span>
              <span>Attendance</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#FFC107' }}></span>
              <span>Completion Rate</span>
            </div>
          </div>
        </div>
        
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons-container">
            <button className="action-button">
              <span className="action-icon">📝</span>
              <span>Create Assignment</span>
            </button>
            <button className="action-button">
              <span className="action-icon">📊</span>
              <span>Take Attendance</span>
            </button>
            <button className="action-button">
              <span className="action-icon">📢</span>
              <span>Make Announcement</span>
            </button>
            <button className="action-button">
              <span className="action-icon">📅</span>
              <span>Schedule Class</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;