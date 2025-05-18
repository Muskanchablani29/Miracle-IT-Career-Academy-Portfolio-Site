import React from 'react';
import './AdminDashboard.css';

const UserManagement = () => {
  return (
    <div className="dashboard-container">
      <h1>User Management</h1>
      <div className="dashboard-content">
        <div className="user-management-header">
          <div className="search-filter">
            <input type="text" placeholder="Search users..." className="search-input" />
            <select className="filter-select">
              <option value="all">All Users</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admins</option>
            </select>
            <button className="btn-primary">Search</button>
          </div>
          <button className="btn-primary">Add New User</button>
        </div>
        
        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>USR001</td>
                <td>John Smith</td>
                <td>john.smith@example.com</td>
                <td>Student</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">🔒</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>USR002</td>
                <td>Priya Sharma</td>
                <td>priya.sharma@example.com</td>
                <td>Student</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">🔒</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>USR003</td>
                <td>Rajesh Kumar</td>
                <td>rajesh.kumar@example.com</td>
                <td>Faculty</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">🔒</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>USR004</td>
                <td>Anita Desai</td>
                <td>anita.desai@example.com</td>
                <td>Faculty</td>
                <td className="status-inactive">Inactive</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">🔓</button>
                  <button className="btn-icon">❌</button>
                </td>
              </tr>
              <tr>
                <td>USR005</td>
                <td>Vikram Singh</td>
                <td>vikram.singh@example.com</td>
                <td>Admin</td>
                <td className="status-active">Active</td>
                <td className="action-buttons">
                  <button className="btn-icon">✏️</button>
                  <button className="btn-icon">🔒</button>
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

export default UserManagement;