import React from 'react';
import './FacultyDashboard.css';

const StudentAttendance = () => {
  return (
    <div className="dashboard-container">
      <h1>Student Attendance</h1>
      <div className="dashboard-content">
        <div className="attendance-filters">
          <div className="filter-group">
            <label>Course:</label>
            <select className="filter-select">
              <option value="web">Web Development</option>
              <option value="python">Python Programming</option>
              <option value="data">Data Science Fundamentals</option>
              <option value="ml">Machine Learning Basics</option>
              <option value="js">JavaScript Fundamentals</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date:</label>
            <input type="date" className="date-input" />
          </div>
          <button className="btn-primary">Load</button>
        </div>
        
        <div className="attendance-summary">
          <div className="summary-card">
            <h3>Total Students</h3>
            <p className="summary-number">45</p>
          </div>
          <div className="summary-card">
            <h3>Present</h3>
            <p className="summary-number">42</p>
            <p className="summary-percentage">93%</p>
          </div>
          <div className="summary-card">
            <h3>Absent</h3>
            <p className="summary-number">3</p>
            <p className="summary-percentage">7%</p>
          </div>
          <div className="summary-card">
            <h3>Course Average</h3>
            <p className="summary-number">89%</p>
            <p className="summary-trend positive">+2%</p>
          </div>
        </div>
        
        <div className="attendance-actions">
          <button className="btn-primary">Take Attendance</button>
          <button className="btn-secondary">Mark All Present</button>
          <button className="btn-secondary">Import Attendance</button>
          <button className="btn-secondary">Export Report</button>
        </div>
        
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Overall %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Smith</td>
                <td>
                  <select className="status-select present">
                    <option value="present" selected>Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
                <td><input type="text" placeholder="Add remarks" className="remarks-input" /></td>
                <td className="attendance-good">95%</td>
                <td className="action-buttons">
                  <button className="btn-icon">📊</button>
                  <button className="btn-icon">📝</button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Priya Sharma</td>
                <td>
                  <select className="status-select present">
                    <option value="present" selected>Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
                <td><input type="text" placeholder="Add remarks" className="remarks-input" /></td>
                <td className="attendance-good">92%</td>
                <td className="action-buttons">
                  <button className="btn-icon">📊</button>
                  <button className="btn-icon">📝</button>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Rajesh Kumar</td>
                <td>
                  <select className="status-select present">
                    <option value="present" selected>Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
                <td><input type="text" placeholder="Add remarks" className="remarks-input" /></td>
                <td className="attendance-good">88%</td>
                <td className="action-buttons">
                  <button className="btn-icon">📊</button>
                  <button className="btn-icon">📝</button>
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Anita Desai</td>
                <td>
                  <select className="status-select absent">
                    <option value="present">Present</option>
                    <option value="absent" selected>Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
                <td><input type="text" value="Informed via email" className="remarks-input" /></td>
                <td className="attendance-warning">78%</td>
                <td className="action-buttons">
                  <button className="btn-icon">📊</button>
                  <button className="btn-icon">📝</button>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Vikram Singh</td>
                <td>
                  <select className="status-select late">
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late" selected>Late</option>
                    <option value="excused">Excused</option>
                  </select>
                </td>
                <td><input type="text" value="Arrived 15 mins late" className="remarks-input" /></td>
                <td className="attendance-good">85%</td>
                <td className="action-buttons">
                  <button className="btn-icon">📊</button>
                  <button className="btn-icon">📝</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="attendance-history">
          <h3>Attendance History</h3>
          <div className="history-chart">
            {/* Chart would be implemented with a library like Chart.js */}
            <div className="mock-chart">
              <div className="chart-bar" style={{ height: '90%', backgroundColor: '#4CAF50' }}>Jul 10</div>
              <div className="chart-bar" style={{ height: '85%', backgroundColor: '#4CAF50' }}>Jul 11</div>
              <div className="chart-bar" style={{ height: '95%', backgroundColor: '#4CAF50' }}>Jul 12</div>
              <div className="chart-bar" style={{ height: '80%', backgroundColor: '#4CAF50' }}>Jul 13</div>
              <div className="chart-bar" style={{ height: '93%', backgroundColor: '#4CAF50' }}>Jul 14</div>
              <div className="chart-bar" style={{ height: '88%', backgroundColor: '#4CAF50' }}>Jul 15</div>
            </div>
          </div>
        </div>
        
        <div className="attendance-save">
          <button className="btn-primary">Save Attendance</button>
          <button className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;