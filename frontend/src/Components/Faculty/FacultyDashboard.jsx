import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { userAxiosInstance } from '../../api';
import './FacultyDashboard.css';
import Sidebar from './Sidebar';
import { FaBook, FaUsers, FaCalendarAlt, FaGraduationCap, FaBullhorn, FaPlus } from 'react-icons/fa';

const FacultyDashboard = () => {
  const { user } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    students: [],
    announcements: [],
    upcomingClasses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userAxiosInstance.get('dashboard/');
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="faculty-dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.username || 'Faculty'}</h1>
          <p>Here's an overview of your teaching activities</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon courses-icon">
              <FaBook />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.courses?.length || 0}</h3>
              <p>Active Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon students-icon">
              <FaUsers />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.students?.length || 0}</h3>
              <p>Enrolled Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon classes-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.upcomingClasses?.length || 0}</h3>
              <p>Upcoming Classes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon announcements-icon">
              <FaBullhorn />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.announcements?.length || 0}</h3>
              <p>Recent Announcements</p>
            </div>
          </div>
        </div>

        <div className="dashboard-quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/faculty/add-course" className="quick-action-card">
              <FaPlus className="action-icon" />
              <span>Add New Course</span>
            </Link>
            <Link to="/faculty/add-workshop" className="quick-action-card">
              <FaPlus className="action-icon" />
              <span>Add New Workshop</span>
            </Link>
            <Link to="/faculty/workshop-registrations" className="quick-action-card">
              <FaUsers className="action-icon" />
              <span>Workshop Registrations</span>
            </Link>
            <Link to="/faculty/attendance" className="quick-action-card">
              <FaCalendarAlt className="action-icon" />
              <span>Take Attendance</span>
            </Link>
            <Link to="/faculty/gradebook" className="quick-action-card">
              <FaGraduationCap className="action-icon" />
              <span>Update Grades</span>
            </Link>
            <Link to="/faculty/announcements" className="quick-action-card">
              <FaBullhorn className="action-icon" />
              <span>Post Announcement</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Courses</h2>
              <Link to="/faculty/courses" className="view-all">View All</Link>
            </div>
            <div className="courses-list">
              {dashboardData.courses && dashboardData.courses.length > 0 ? (
                dashboardData.courses.slice(0, 3).map(course => (
                  <div className="course-card" key={course.id}>
                    <div className="course-image">
                      <img src={course.image || 'https://via.placeholder.com/150'} alt={course.title} />
                    </div>
                    <div className="course-details">
                      <h3>{course.title}</h3>
                      <p>{course.students_count || 0} students enrolled</p>
                      <Link to={`/faculty/courses/${course.id}`} className="view-course-btn">Manage Course</Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No courses available. <Link to="/faculty/add-course">Add a new course</Link>.</p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Upcoming Classes</h2>
              <Link to="/faculty/attendance" className="view-all">View Schedule</Link>
            </div>
            <div className="upcoming-classes">
              {dashboardData.upcomingClasses && dashboardData.upcomingClasses.length > 0 ? (
                dashboardData.upcomingClasses.map(classItem => (
                  <div className="class-card" key={classItem.id}>
                    <div className="class-date">
                      <span className="date-day">{new Date(classItem.date).getDate()}</span>
                      <span className="date-month">{new Date(classItem.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="class-details">
                      <h3>{classItem.course_title}</h3>
                      <p>{classItem.time} • {classItem.location}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No upcoming classes scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;