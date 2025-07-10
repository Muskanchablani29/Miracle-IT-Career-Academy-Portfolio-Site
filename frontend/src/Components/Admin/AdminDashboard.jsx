import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';
import './AdminDashboard.css';
import ReceiptModal from '../Common/ReceiptModal';
import { 
  FaBook, FaUsers, FaCalendarAlt, FaBullhorn, 
  FaPlus, FaChartLine, FaArrowRight, FaLayerGroup, 
  FaClipboardList, FaUserGraduate, FaRegClock, FaExclamationTriangle,
  FaChevronLeft, FaChevronRight, FaDollarSign, FaBell
} from 'react-icons/fa';
import { 
  HiAcademicCap, HiChartBar, HiClock, HiCollection, 
  HiCube, HiLightningBolt, HiOutlineSparkles
} from 'react-icons/hi';

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    activeCourses: 0,
    feeCollection: 0,
    recentPayments: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch fee reports
      const feeResponse = await fetch('http://localhost:8000/api/fee-reports/');
      const feeData = await feeResponse.json();
      
      // Fetch courses
      const coursesResponse = await fetch('http://localhost:8000/api/courses/courses/');
      const coursesData = await coursesResponse.json();
      
      setDashboardData({
        totalStudents: feeData.total_students,
        totalFaculty: 1,
        activeCourses: coursesData.length,
        feeCollection: feeData.total_fees_collected,
        recentPayments: feeData.recent_payments || [],
        notifications: []
      });
      
      await fetchNotifications();
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get('http://localhost:8000/api/admin-notifications/', { headers });
      
      setDashboardData(prev => ({
        ...prev,
        notifications: response.data || []
      }));
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setDashboardData(prev => ({
        ...prev,
        notifications: []
      }));
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(`http://localhost:8000/api/admin-notifications/${notificationId}/mark_read/`, {}, { headers });
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      }));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post('http://localhost:8000/api/admin-notifications/mark_all_read/', {}, { headers });
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif => ({ ...notif, is_read: true }))
      }));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="dashboard-content">
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header admin-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🏛️ Admin Control Center</h1>
            <p>Manage your institute operations and monitor system performance</p>
          </div>
          <div className="header-actions">
            <div className="admin-badge">Administrator</div>
            <div className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section-wrapper">
        <div className="section-header-main">
          <h2><HiChartBar /> Dashboard Overview</h2>
          <p>Real-time statistics and key metrics</p>
        </div>
        <div className="dashboard-stats admin-stats">
          <div className="stat-card admin-stat-card">
            <div className="stat-header">
              <span className="stat-category">Students</span>
            </div>
            <div className="stat-icon students-icon admin-icon">
              <HiAcademicCap size={28} />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.totalStudents}</h3>
              <p>Total Students</p>
              <span className="stat-trend">+12% this month</span>
            </div>
          </div>
          <div className="stat-card admin-stat-card">
            <div className="stat-header">
              <span className="stat-category">Faculty</span>
            </div>
            <div className="stat-icon faculty-icon admin-icon">
              <HiCollection size={28} />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.totalFaculty}</h3>
              <p>Faculty Members</p>
              <span className="stat-trend">+2 new hires</span>
            </div>
          </div>
          <div className="stat-card admin-stat-card">
            <div className="stat-header">
              <span className="stat-category">Courses</span>
            </div>
            <div className="stat-icon courses-icon admin-icon">
              <HiCube size={28} />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.activeCourses}</h3>
              <p>Active Courses</p>
              <span className="stat-trend">3 new courses</span>
            </div>
          </div>
          <div className="stat-card admin-stat-card">
            <div className="stat-header">
              <span className="stat-category">Revenue</span>
            </div>
            <div className="stat-icon revenue-icon admin-icon">
              <HiChartBar size={28} />
            </div>
            <div className="stat-details">
              <h3>₹{(dashboardData.feeCollection / 100000).toFixed(1)}L</h3>
              <p>Fee Collection</p>
              <span className="stat-trend">+8% vs last month</span>
            </div>
          </div>
          <div className="stat-card admin-stat-card">
            <div className="stat-header">
              <span className="stat-category">Alerts</span>
            </div>
            <div className="stat-icon notifications-icon admin-icon">
              <HiLightningBolt size={28} />
            </div>
            <div className="stat-details">
              <h3>{dashboardData.notifications ? dashboardData.notifications.filter(n => !n.is_read).length : 0}</h3>
              <p>Pending Alerts</p>
              <span className="stat-trend">Requires attention</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section-wrapper">
        <div className="section-header-main">
          <h2><HiLightningBolt /> Quick Actions</h2>
          <p>Administrative tools and management options</p>
        </div>
        <div className="dashboard-quick-actions-admin admin-actions-dashboard">
          <div className="quick-actions-grid admin-grid">
            <Link to="/admin/add-course" className="quick-action-card admin-action-card">
              <div className="action-header">
                <span className="action-category">Academic</span>
              </div>
              <HiOutlineSparkles className="action-icon" size={24} />
              <span>Add Course</span>
              <small>Create new programs</small>
            </Link>
            <Link to="/admin/add-workshop" className="quick-action-card admin-action-card">
              <div className="action-header">
                <span className="action-category">Events</span>
              </div>
              <HiCube className="action-icon" size={24} />
              <span>Add Workshop</span>
              <small>Schedule events</small>
            </Link>
            <Link to="/admin/fee-management" className="quick-action-card admin-action-card">
              <div className="action-header">
                <span className="action-category">Finance</span>
              </div>
              <FaDollarSign className="action-icon" size={24} />
              <span>Fee Management</span>
              <small>Handle payments</small>
            </Link>
            <Link to="/admin/create-student" className="quick-action-card admin-action-card">
              <div className="action-header">
                <span className="action-category">Students</span>
              </div>
              <HiAcademicCap className="action-icon" size={24} />
              <span>Add Student</span>
              <small>Enroll new students</small>
            </Link>
            <Link to="/admin/create-faculty" className="quick-action-card admin-action-card">
              <div className="action-header">
                <span className="action-category">Staff</span>
              </div>
              <HiCollection className="action-icon" size={24} />
              <span>Add Faculty</span>
              <small>Hire instructors</small>
            </Link>
            <Link to="/admin/user-management" className="quick-action-card admin-action-card">
              <div className="action-header">
                <span className="action-category">Users</span>
              </div>
              <HiClock className="action-icon" size={24} />
              <span>User Management</span>
              <small>Manage accounts</small>
            </Link>
            <Link to="/admin/system-settings" className="quick-action-card admin-action-card">
              <div className="action-header">
                <span className="action-category">System</span>
              </div>
              <HiLightningBolt className="action-icon" size={24} />
              <span>System Settings</span>
              <small>Configure system</small>
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2><FaDollarSign /> Recent Payments</h2>
            <Link to="/admin/fee-management" className="view-all">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="courses-list">
            {dashboardData.recentPayments && dashboardData.recentPayments.length > 0 ? (
              <ul className="course-list-items">
                {dashboardData.recentPayments.map((payment, index) => (
                  <li className="course-list-item" key={index}>
                    <div className="course-list-image">
                      <div className="payment-avatar">
                        {payment.student_name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="course-list-content">
                      <h3>{payment.student_name}</h3>
                      <div className="course-list-meta">
                        <span className="course-students"><HiAcademicCap /> <span className="count-badge">₹{payment.amount.toLocaleString()}</span></span>
                        <span className="course-level"><HiCollection /> <span className="level-badge">{new Date(payment.date).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                    <div className="course-list-actions">
                      <span className="view-course-btn success">Paid <FaArrowRight /></span>
                      {payment.receipt_number && (
                        <button 
                          className="btn-small btn-primary"
                          onClick={() => {
                            setCurrentReceipt({
                              receipt_number: payment.receipt_number,
                              payment_date: payment.date,
                              student_name: payment.student_name,
                              enrollment_id: 'N/A',
                              course: 'N/A',
                              amount: payment.amount,
                              payment_mode: 'online',
                              transaction_id: 'N/A',
                              status: 'success'
                            });
                            setShowReceiptModal(true);
                          }}
                          style={{marginTop: '5px', padding: '2px 6px', fontSize: '11px'}}
                        >
                          📄 View Receipt
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-data-message">
                <FaExclamationTriangle />
                <p>No recent payments.</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2><FaBell /> Notifications</h2>
            <button 
              onClick={markAllNotificationsAsRead}
              className="notification-badge"
              style={{background: 'none', border: 'none', color: '#3399cc', cursor: 'pointer'}}
            >
              Mark All Read ({dashboardData.notifications ? dashboardData.notifications.filter(n => !n.is_read).length : 0} unread)
            </button>
          </div>
          <div className="activities-list">
            {dashboardData.notifications && dashboardData.notifications.length > 0 ? (
              dashboardData.notifications.map(notification => (
                <div 
                  className={`activity-card ${notification.is_read ? 'read' : 'unread'}`} 
                  key={notification.id}
                  onClick={() => !notification.is_read && markNotificationAsRead(notification.id)}
                >
                  <div className="activity-time">
                    {notification.notification_type === 'payment' && '💰'}
                    {notification.notification_type === 'enrollment' && '📚'}
                    {notification.notification_type === 'system' && '⚙️'}
                    {notification.notification_type === 'fee_due' && '⏰'}
                  </div>
                  <div className="activity-details">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <p className="activity-course">{notification.time_ago}</p>
                  </div>
                  {!notification.is_read && <div className="unread-indicator"></div>}
                </div>
              ))
            ) : (
              <div className="no-data-message">
                <FaExclamationTriangle />
                <p>No notifications.</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2><FaChartLine /> System Overview</h2>
          </div>
          <div className="upcoming-classes">
            <div className="class-card">
              <div className="workshop-tag upcoming-tag">
                Active <HiLightningBolt />
              </div>
              <div className="class-date">
                <span className="date-day">85</span>
                <span className="date-month">%</span>
              </div>
              <div className="class-details">
                <h3>Fee Collection Rate</h3>
                <p>85% of students have paid their fees</p>
              </div>
            </div>
            <div className="class-card">
              <div className="workshop-tag upcoming-tag">
                Active <HiLightningBolt />
              </div>
              <div className="class-date">
                <span className="date-day">92</span>
                <span className="date-month">%</span>
              </div>
              <div className="class-details">
                <h3>Student Attendance</h3>
                <p>Average attendance rate across all courses</p>
              </div>
            </div>
            <div className="class-card">
              <div className="workshop-tag upcoming-tag">
                Active <HiLightningBolt />
              </div>
              <div className="class-date">
                <span className="date-day">78</span>
                <span className="date-month">%</span>
              </div>
              <div className="class-details">
                <h3>Course Completion</h3>
                <p>Students completing their enrolled courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showReceiptModal && (
        <ReceiptModal 
          payment={currentReceipt}
          onClose={() => setShowReceiptModal(false)}
          canDownload={true}
        />
      )}
    </div>
  );
};

export default AdminDashboard;