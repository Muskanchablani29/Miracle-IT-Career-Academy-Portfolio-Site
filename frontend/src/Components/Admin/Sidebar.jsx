import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaCertificate, FaCog, FaPlus, FaUserCircle } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  // Check if the current path matches the link path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin Dashboard</h3>
      </div>
      <ul className="sidebar-menu">
        <li className={isActive('/admin') ? 'active' : ''}>
          <Link to="/admin">
            <FaHome className="icon" /> Dashboard
          </Link>
        </li>
        <li className={isActive('/admin/courses') ? 'active' : ''}>
          <Link to="/admin/courses">
            <FaBook className="icon" /> Courses
          </Link>
        </li>
        <li className={isActive('/admin/add-course') ? 'active' : ''}>
          <Link to="/admin/add-course">
            <FaPlus className="icon" /> Add Course
          </Link>
        </li>
        <li className={isActive('/admin/add-workshop') ? 'active' : ''}>
          <Link to="/admin/add-workshop">
            <FaPlus className="icon" /> Add Workshop
          </Link>
        </li>
        <li className={isActive('/admin/workshop-registrations') ? 'active' : ''}>
          <Link to="/admin/workshop-registrations">
            <FaUsers className="icon" /> Workshop Registrations
          </Link>
        </li>
        <li className={isActive('/admin/users') ? 'active' : ''}>
          <Link to="/admin/users">
            <FaUsers className="icon" /> User Management
          </Link>
        </li>
        <li className={isActive('/admin/registered-users') ? 'active' : ''}>
          <Link to="/admin/registered-users">
            <FaUserCircle className="icon" /> Registered Users
          </Link>
        </li>
        <li className={isActive('/admin/attendance') ? 'active' : ''}>
          <Link to="/admin/attendance">
            <FaCalendarAlt className="icon" /> Attendance Logs
          </Link>
        </li>
        <li className={isActive('/admin/fees') ? 'active' : ''}>
          <Link to="/admin/fees">
            <FaMoneyBillWave className="icon" /> Fee Tracking
          </Link>
        </li>
        <li className={isActive('/admin/certificates') ? 'active' : ''}>
          <Link to="/admin/certificates">
            <FaCertificate className="icon" /> Certificates
          </Link>
        </li>
        <li className={isActive('/admin/settings') ? 'active' : ''}>
          <Link to="/admin/settings">
            <FaCog className="icon" /> System Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;