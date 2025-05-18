import React from 'react';
import './FacultyDashboard.css';

const StudentList = () => {
  return (
    <div className="dashboard-container">
      <h1>Student List</h1>
      <div className="dashboard-content">
        <div className="student-filters">
          <div className="search-filter">
            <input type="text" placeholder="Search students..." className="search-input" />
            <select className="filter-select">
              <option value="all">All Courses</option>
              <option value="web">Web Development</option>
              <option value="python">Python Programming</option>
              <option value="data">Data Science Fundamentals</option>
              <option value="ml">Machine Learning Basics</option>
              <option value="js">JavaScript Fundamentals</option>
            </select>
            <button className="btn-primary">Search</button>
          </div>
          <div className="filter-actions">
            <button className="btn-secondary">Export List</button>
            <button className="btn-secondary">Print</button>
          </div>
        </div>
        
        <div className="student-stats">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p className="stat-number">165</p>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <p className="stat-number">158</p>
            <p className="stat-percentage">96%</p>
          </div>
          <div className="stat-card">
            <h3>On Leave</h3>
            <p className="stat-number">5</p>
            <p className="stat-percentage">3%</p>
          </div>
          <div className="stat-card">
            <h3>Inactive</h3>
            <p className="stat-number">2</p>
            <p className="stat-percentage">1%</p>
          </div>
        </div>
        
        <div className="student-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>STU001</td>
                <td>John Smith</td>
                <td>Web Development</td>
                <td>john.smith@example.com</td>
                <td>+91 9876543210</td>
                <td className="attendance-good">95%</td>
                <td className="grade-good">A (90%)</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">📝</button>
                  <button className="btn-icon">📊</button>
                </td>
              </tr>
              <tr>
                <td>STU002</td>
                <td>Priya Sharma</td>
                <td>Python Programming</td>
                <td>priya.sharma@example.com</td>
                <td>+91 9876543211</td>
                <td className="attendance-good">92%</td>
                <td className="grade-good">B+ (85%)</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">📝</button>
                  <button className="btn-icon">📊</button>
                </td>
              </tr>
              <tr>
                <td>STU003</td>
                <td>Rajesh Kumar</td>
                <td>Data Science Fundamentals</td>
                <td>rajesh.kumar@example.com</td>
                <td>+91 9876543212</td>
                <td className="attendance-good">88%</td>
                <td className="grade-good">B (80%)</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">📝</button>
                  <button className="btn-icon">📊</button>
                </td>
              </tr>
              <tr>
                <td>STU004</td>
                <td>Anita Desai</td>
                <td>Machine Learning Basics</td>
                <td>anita.desai@example.com</td>
                <td>+91 9876543213</td>
                <td className="attendance-warning">78%</td>
                <td className="grade-average">C+ (75%)</td>
                <td className="status-leave">On Leave</td>
                <td className="action-buttons">
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">📝</button>
                  <button className="btn-icon">📊</button>
                </td>
              </tr>
              <tr>
                <td>STU005</td>
                <td>Vikram Singh</td>
                <td>JavaScript Fundamentals</td>
                <td>vikram.singh@example.com</td>
                <td>+91 9876543214</td>
                <td className="attendance-poor">68%</td>
                <td className="grade-warning">C (70%)</td>
                <td className="status-inactive">Inactive</td>
                <td className="action-buttons">
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">📝</button>
                  <button className="btn-icon">📊</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="student-details-panel">
          <h3>Student Details</h3>
          <div className="student-profile">
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-placeholder">JS</div>
              </div>
              <div className="profile-info">
                <h2>John Smith</h2>
                <p>Student ID: STU001</p>
                <p>Course: Web Development</p>
                <p>Batch: 2023-24</p>
              </div>
            </div>
            
            <div className="profile-tabs">
              <button className="tab-btn active">Overview</button>
              <button className="tab-btn">Attendance</button>
              <button className="tab-btn">Grades</button>
              <button className="tab-btn">Assignments</button>
              <button className="tab-btn">Notes</button>
            </div>
            
            <div className="profile-content">
              <div className="profile-section">
                <h4>Performance Summary</h4>
                <div className="performance-metrics">
                  <div className="metric-card">
                    <h5>Attendance</h5>
                    <p className="metric-value good">95%</p>
                  </div>
                  <div className="metric-card">
                    <h5>Overall Grade</h5>
                    <p className="metric-value good">A (90%)</p>
                  </div>
                  <div className="metric-card">
                    <h5>Assignments</h5>
                    <p className="metric-value good">12/12 Submitted</p>
                  </div>
                  <div className="metric-card">
                    <h5>Quizzes</h5>
                    <p className="metric-value good">5/5 Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h4>Recent Activity</h4>
                <div className="activity-timeline">
                  <div className="timeline-item">
                    <div className="timeline-date">Jul 15</div>
                    <div className="timeline-content">
                      <p>Submitted Assignment #12</p>
                      <p className="timeline-meta">Grade: 92/100</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">Jul 14</div>
                    <div className="timeline-content">
                      <p>Attended Class: Advanced React Components</p>
                      <p className="timeline-meta">Duration: 2 hours</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">Jul 12</div>
                    <div className="timeline-content">
                      <p>Completed Quiz #5</p>
                      <p className="timeline-meta">Score: 9/10</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="btn-primary">Send Message</button>
                <button className="btn-secondary">Download Report</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pagination">
          <button className="pagination-btn">Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;