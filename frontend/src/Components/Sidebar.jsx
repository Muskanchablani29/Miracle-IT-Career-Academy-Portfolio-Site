import * as e from 'express';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Sidebar.css';
import logo from './Images/Logo-miracle.png';

const Sidebar = () => {
  const { user } = useContext(UserContext);

  // If no user or role, don't render sidebar
  if (!user || !user.role) return null;

  // Define navigation links based on user role
  const getNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: '📊' },
          { to: '/admin/users', label: 'Manage Users', icon: '👥' },
          { to: '/admin/courses', label: 'Manage Courses', icon: '📚' },
          { to: '/admin/reports', label: 'Reports', icon: '📝' },
          { to: '/admin/settings', label: 'Settings', icon: '⚙️' }
        ];
      case 'faculty':
        return [
          { to: '/faculty', label: 'Dashboard', icon: '📊' },
          { to: '/faculty/courses', label: 'My Courses', icon: '📚' },
          { to: '/faculty/students', label: 'Students', icon: '👨‍🎓' },
          { to: '/faculty/assignments', label: 'Assignments', icon: '📝' },
          { to: '/faculty/settings', label: 'Settings', icon: '⚙️'}

        ];
      case 'student':
        return [
          { to: '/student', label: 'Dashboard', icon: '📊' },
          { to: '/student/courses', label: 'My Courses', icon: '📚' },
          { to: '/student/assignments', label: 'Assignments', icon: '📝' },
          { to: '/student/progress', label: 'Progress', icon: '📈' },
          { to: '/student/settings', label: 'Settings', icon: '⚙️' },
          { to: '/student/explore', label: 'Explore', icon: '🔍' }

        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Link to={`/${user.role}`}>
          <img src={logo} alt="Miracle Logo" className="sidebar-logo-img" />
        </Link>
      </div>
      <div className="sidebar-header">
        <h3>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel</h3>
      </div>
      <ul className="sidebar-menu">
        {navLinks.map((link, index) => (
          <li key={index} className="sidebar-item">
            <Link to={link.to} className="sidebar-link">
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-text">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;