import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';
import './StudentList.css';
import CreateStudent from './CreateStudent';
import { userAxiosInstance } from '../../api';

const StudentList = () => {
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Update localStorage with highest enrollment ID when students change
  useEffect(() => {
    if (students.length > 0) {
      const enrollmentIds = students.map(s => s.enrollmentId);
      const highestId = enrollmentIds.reduce((max, id) => {
        const currentNum = parseInt(id.replace('MIRA', ''));
        const maxNum = parseInt(max.replace('MIRA', ''));
        return currentNum > maxNum ? id : max;
      }, 'MIRA0000');
      
      localStorage.setItem('lastEnrollmentId', highestId);
    }
  }, [students]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch students created by this faculty
      const response = await userAxiosInstance.get('students/');
      
      // Format the data
      const formattedStudents = response.data.map(student => ({
        id: student.id,
        name: student.user.username,
        email: student.user.email,
        enrollmentId: student.enrollment_id,
        dateOfBirth: student.date_of_birth,
        course: 'Web Development', // This would come from your actual data
        attendance: '95%',
        performance: 'A (90%)',
        status: 'Active'
      }));
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = () => {
    setShowCreateStudent(true);
  };

  const handleStudentCreated = () => {
    // Update the student list
    fetchStudents();
    
    // Find the highest enrollment ID to update localStorage
    if (students.length > 0) {
      const enrollmentIds = students.map(s => s.enrollmentId);
      const highestId = enrollmentIds.reduce((max, id) => {
        const currentNum = parseInt(id.replace('MIRA', ''));
        const maxNum = parseInt(max.replace('MIRA', ''));
        return currentNum > maxNum ? id : max;
      }, 'MIRA0000');
      
      localStorage.setItem('lastEnrollmentId', highestId);
    }
  };

  const filteredStudents = students.filter(student => {
    if (selectedCourse !== 'all' && student.course !== selectedCourse) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.enrollmentId.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  return (
    <div className="dashboard-container">
      <h1>Student List</h1>
      <div className="dashboard-content">
        <div className="student-filters">
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="Search students..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="filter-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="Web Development">Web Development</option>
              <option value="Python Programming">Python Programming</option>
              <option value="Data Science Fundamentals">Data Science Fundamentals</option>
              <option value="Machine Learning Basics">Machine Learning Basics</option>
              <option value="JavaScript Fundamentals">JavaScript Fundamentals</option>
            </select>
            <button className="btn-primary">Search</button>
          </div>
          <div className="filter-actions">
            <button className="btn-primary" onClick={handleCreateStudent}>Add Student</button>
            <button className="btn-secondary">Export List</button>
          </div>
        </div>
        
        <div className="student-stats">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p className="stat-number">{students.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active</h3>
            <p className="stat-number">{students.filter(s => s.status === 'Active').length}</p>
            <p className="stat-percentage">
              {students.length ? Math.round((students.filter(s => s.status === 'Active').length / students.length) * 100) : 0}%
            </p>
          </div>
          <div className="stat-card">
            <h3>On Leave</h3>
            <p className="stat-number">{students.filter(s => s.status === 'On Leave').length}</p>
            <p className="stat-percentage">
              {students.length ? Math.round((students.filter(s => s.status === 'On Leave').length / students.length) * 100) : 0}%
            </p>
          </div>
          <div className="stat-card">
            <h3>Inactive</h3>
            <p className="stat-number">{students.filter(s => s.status === 'Inactive').length}</p>
            <p className="stat-percentage">
              {students.length ? Math.round((students.filter(s => s.status === 'Inactive').length / students.length) * 100) : 0}%
            </p>
          </div>
        </div>
        
        <div className="student-table">
          <table>
            <thead>
              <tr>
                <th>Enrollment ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="loading-cell">Loading students...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">No students found</td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.enrollmentId}</td>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>{student.email}</td>
                    <td>{student.dateOfBirth}</td>
                    <td className={`status-${student.status.toLowerCase().replace(' ', '-')}`}>
                      {student.status}
                    </td>
                    <td className="action-buttons">
                      <button className="btn-icon" title="View Details">👁️</button>
                      <button className="btn-icon" title="Edit">📝</button>
                      <button className="btn-icon" title="Performance">📊</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {students.length > 0 && (
          <div className="pagination">
            <button className="pagination-btn">Previous</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">Next</button>
          </div>
        )}
      </div>
      
      {showCreateStudent && (
        <CreateStudent 
          onClose={() => setShowCreateStudent(false)} 
          onSuccess={handleStudentCreated}
        />
      )}
    </div>
  );
};

export default StudentList;