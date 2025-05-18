import React from 'react';
import './AdminDashboard.css';

const CourseManagement = () => {
  return (
    <div className="dashboard-container">
      <h1>Course Management</h1>
      <div className="dashboard-content">
        <div className="course-management-header">
          <div className="search-filter">
            <input type="text" placeholder="Search courses..." className="search-input" />
            <select className="filter-select">
              <option value="all">All Categories</option>
              <option value="web">Web Development</option>
              <option value="programming">Programming</option>
              <option value="data">Data Science</option>
              <option value="ai">AI & ML</option>
              <option value="cloud">Cloud Computing</option>
            </select>
            <button className="btn-primary">Search</button>
          </div>
          <button className="btn-primary">Add New Course</button>
        </div>
        
        <div className="course-table">
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Category</th>
                <th>Faculty</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CRS001</td>
                <td>Full Stack Web Development</td>
                <td>Web Development</td>
                <td>Rajesh Kumar</td>
                <td>45</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>CRS002</td>
                <td>Python Programming</td>
                <td>Programming</td>
                <td>Anita Desai</td>
                <td>38</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>CRS003</td>
                <td>Data Science Fundamentals</td>
                <td>Data Science</td>
                <td>Vikram Singh</td>
                <td>32</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>CRS004</td>
                <td>Machine Learning Basics</td>
                <td>AI & ML</td>
                <td>Priya Sharma</td>
                <td>28</td>
                <td className="status-inactive">Inactive</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>CRS005</td>
                <td>AWS Cloud Practitioner</td>
                <td>Cloud Computing</td>
                <td>Amit Kumar</td>
                <td>22</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">👁️</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
            </tbody>
          </table>
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

export default CourseManagement;