import React, { useContext, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Navbar.css';
import logo from './Images/Logo-miracle.png'

// Move static data outside component to prevent recreation on each render
const ROLE_DASHBOARD_LINKS = {
  student: [
    { to: '/student', label: 'Student Dashboard' },
    { to: '/student/courses', label: 'My Courses' },
  ],
  faculty: [
    { to: '/faculty', label: 'Faculty Dashboard' },
    { to: '/faculty/courses', label: 'Manage Courses' },
  ],
  admin: [
    { to: '/admin', label: 'Admin Dashboard' },
    { to: '/admin/users', label: 'Manage Users' },
  ],
};

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardOpen, setDashboardOpen] = useState(false);

  // Memoize the logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    navigate('/');
  }, [setUser, navigate]);

  // Memoize static JSX elements
  const commonLinks = useMemo(() => (
    <>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/services">Services</Link></li>
      <li><Link to="/courses">Courses</Link></li>
    </>
  ), []);

  const guestLinks = useMemo(() => (
    <>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/signup">Signup</Link></li>
    </>
  ), []);

  const logoutButton = useMemo(() => (
    <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
  ), [handleLogout]);

  // Toggle dashboard visibility
  const toggleDashboard = useCallback(() => {
    setDashboardOpen(prevState => !prevState);
  }, []);

  // Memoize right nav items to prevent unnecessary re-renders
  const rightNavItems = useMemo(() => {
    if (!user) return guestLinks;
    
    return (
      <>
        <li>
          <button className="dashboard-toggle" onClick={toggleDashboard}>
            {/* More efficient way to capitalize */}
            {user.role[0].toUpperCase() + user.role.slice(1)} Dashboard
          </button>
        </li>
        {logoutButton}
      </>
    );
  }, [user, guestLinks, logoutButton, toggleDashboard]);

  // Memoize dashboard links based on user role
  const dashboardLinks = useMemo(() => {
    if (!user) return null;
    
    return ROLE_DASHBOARD_LINKS[user.role]?.map((item) => (
      <li key={item.to}>
        <Link to={item.to} onClick={() => setDashboardOpen(false)}>
          {item.label}
        </Link>
      </li>
    ));
  }, [user]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="" />
        </div>
        <div className="nav-right">
          <ul className="nav-list">
            {commonLinks}
            {rightNavItems}
          </ul>
        </div>
      </nav>
      {dashboardOpen && user && (
        <div className="extended-navbar">
          <ul className="extended-nav-list">
            {dashboardLinks}
          </ul>
        </div>
      )}
    </>
  );
};

export default React.memo(Navbar);