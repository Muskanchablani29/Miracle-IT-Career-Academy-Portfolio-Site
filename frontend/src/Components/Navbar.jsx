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

  // Toggle dashboard visibility
  const toggleDashboard = useCallback(() => {
    setDashboardOpen(prevState => !prevState);
  }, []);

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
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/signup">Register</Link></li>
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