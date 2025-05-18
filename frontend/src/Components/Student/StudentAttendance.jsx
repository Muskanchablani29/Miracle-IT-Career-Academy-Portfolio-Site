import React from 'react';
import './StudentDashboard.css';

const StudentAttendance = () => {
  return (
    <div className="dashboard-container">
      <h1>Attendance</h1>
      <div className="dashboard-content">
        <p>View your attendance records for all courses.</p>
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Total Classes</th>
                <th>Classes Attended</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Web Development</td>
                <td>24</td>
                <td>22</td>
                <td>91.67%</td>
                <td className="status-good">Good</td>
              </tr>
              <tr>
                <td>Python Programming</td>
                <td>18</td>
                <td>15</td>
                <td>83.33%</td>
                <td className="status-good">Good</td>
              </tr>
              <tr>
                <td>Data Science</td>
                <td>12</td>
                <td>8</td>
                <td>66.67%</td>
                <td className="status-warning">Warning</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;