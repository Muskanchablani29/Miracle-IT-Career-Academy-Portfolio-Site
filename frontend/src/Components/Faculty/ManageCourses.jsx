import React from 'react';
import './FacultyDashboard.css';

const ManageCourses = () => {
  return (
    <div className="dashboard-container">
      <h1>Manage Courses</h1>
      <div className="dashboard-content">
        <div className="course-filters">
          <div className="search-filter">
            <input type="text" placeholder="Search courses..." className="search-input" />
            <select className="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn-primary">Search</button>
          </div>
          <button className="btn-primary">Request New Course</button>
        </div>
        
        <div className="courses-grid">
          <div className="course-card active">
            <div className="course-header">
              <h3>Web Development</h3>
              <span className="course-badge active">Active</span>
            </div>
            <div className="course-details">
              <p><strong>Code:</strong> WD101</p>
              <p><strong>Students:</strong> 45</p>
              <p><strong>Schedule:</strong> Mon, Wed, Fri - 10:00 AM</p>
              <p><strong>Progress:</strong> 65% completed</p>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '65%' }}></div>
            </div>
            <div className="course-actions">
              <button className="btn-primary">Manage</button>
              <button className="btn-secondary">Materials</button>
              <button className="btn-secondary">Grades</button>
            </div>
          </div>
          
          <div className="course-card active">
            <div className="course-header">
              <h3>Python Programming</h3>
              <span className="course-badge active">Active</span>
            </div>
            <div className="course-details">
              <p><strong>Code:</strong> PY201</p>
              <p><strong>Students:</strong> 38</p>
              <p><strong>Schedule:</strong> Tue, Thu - 2:00 PM</p>
              <p><strong>Progress:</strong> 50% completed</p>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '50%' }}></div>
            </div>
            <div className="course-actions">
              <button className="btn-primary">Manage</button>
              <button className="btn-secondary">Materials</button>
              <button className="btn-secondary">Grades</button>
            </div>
          </div>
          
          <div className="course-card active">
            <div className="course-header">
              <h3>Data Science Fundamentals</h3>
              <span className="course-badge active">Active</span>
            </div>
            <div className="course-details">
              <p><strong>Code:</strong> DS301</p>
              <p><strong>Students:</strong> 32</p>
              <p><strong>Schedule:</strong> Mon, Wed - 4:00 PM</p>
              <p><strong>Progress:</strong> 40% completed</p>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '40%' }}></div>
            </div>
            <div className="course-actions">
              <button className="btn-primary">Manage</button>
              <button className="btn-secondary">Materials</button>
              <button className="btn-secondary">Grades</button>
            </div>
          </div>
          
          <div className="course-card upcoming">
            <div className="course-header">
              <h3>Machine Learning Basics</h3>
              <span className="course-badge upcoming">Upcoming</span>
            </div>
            <div className="course-details">
              <p><strong>Code:</strong> ML401</p>
              <p><strong>Students:</strong> 28</p>
              <p><strong>Schedule:</strong> Tue, Thu - 10:00 AM</p>
              <p><strong>Starts:</strong> Aug 15, 2023</p>
            </div>
            <div className="course-actions">
              <button className="btn-primary">Prepare</button>
              <button className="btn-secondary">Materials</button>
              <button className="btn-secondary">Students</button>
            </div>
          </div>
          
          <div className="course-card completed">
            <div className="course-header">
              <h3>JavaScript Fundamentals</h3>
              <span className="course-badge completed">Completed</span>
            </div>
            <div className="course-details">
              <p><strong>Code:</strong> JS101</p>
              <p><strong>Students:</strong> 42</p>
              <p><strong>Completed:</strong> Jun 30, 2023</p>
              <p><strong>Avg. Grade:</strong> B+ (85%)</p>
            </div>
            <div className="course-actions">
              <button className="btn-primary">View Report</button>
              <button className="btn-secondary">Materials</button>
              <button className="btn-secondary">Grades</button>
            </div>
          </div>
        </div>
        
        <div className="course-management-section">
          <h3>Course Management Tools</h3>
          <div className="management-tools">
            <div className="tool-card">
              <div className="tool-icon">📚</div>
              <h4>Course Materials</h4>
              <p>Upload and manage course materials, slides, and resources</p>
              <button className="btn-secondary">Access</button>
            </div>
            <div className="tool-card">
              <div className="tool-icon">📝</div>
              <h4>Assignments</h4>
              <p>Create, distribute, and grade assignments</p>
              <button className="btn-secondary">Access</button>
            </div>
            <div className="tool-card">
              <div className="tool-icon">📊</div>
              <h4>Gradebook</h4>
              <p>Manage and track student grades and performance</p>
              <button className="btn-secondary">Access</button>
            </div>
            <div className="tool-card">
              <div className="tool-icon">📅</div>
              <h4>Schedule</h4>
              <p>Manage course schedule and calendar</p>
              <button className="btn-secondary">Access</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;