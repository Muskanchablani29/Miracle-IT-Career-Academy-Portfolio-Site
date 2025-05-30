import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaUsers, FaCalendarAlt, FaGraduationCap, FaBullhorn, FaPlus } from 'react-icons/fa';
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
        <h3>Faculty Dashboard</h3>
      </div>
      <ul className="sidebar-menu">
        <li className={isActive('/faculty') ? 'active' : ''}>
          <Link to="/faculty">
            <FaHome className="icon" /> Dashboard
          </Link>
        </li>
        <li className={isActive('/faculty/courses') ? 'active' : ''}>
          <Link to="/faculty/courses">
            <FaBook className="icon" /> Manage Courses
          </Link>
        </li>
        <li className={isActive('/faculty/add-course') ? 'active' : ''}>
          <Link to="/faculty/add-course">
            <FaPlus className="icon" /> Add Course
          </Link>
        </li>
        <li className={isActive('/faculty/add-workshop') ? 'active' : ''}>
          <Link to="/faculty/add-workshop">
            <FaPlus className="icon" /> Add Workshop
          </Link>
        </li>
        <li className={isActive('/faculty/workshop-registrations') ? 'active' : ''}>
          <Link to="/faculty/workshop-registrations">
            <FaUsers className="icon" /> Workshop Registrations
          </Link>
        </li>
        <li className={isActive('/faculty/attendance') ? 'active' : ''}>
          <Link to="/faculty/attendance">
            <FaCalendarAlt className="icon" /> Student Attendance
          </Link>
        </li>
        <li className={isActive('/faculty/gradebook') ? 'active' : ''}>
          <Link to="/faculty/gradebook">
            <FaGraduationCap className="icon" /> Gradebook
          </Link>
        </li>
        <li className={isActive('/faculty/announcements') ? 'active' : ''}>
          <Link to="/faculty/announcements">
            <FaBullhorn className="icon" /> Announcements
          </Link>
        </li>
        <li className={isActive('/faculty/students') ? 'active' : ''}>
          <Link to="/faculty/students">
            <FaUsers className="icon" /> Student List
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;