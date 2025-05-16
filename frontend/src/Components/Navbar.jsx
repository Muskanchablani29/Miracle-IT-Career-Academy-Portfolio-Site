import React, { useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Navbar.css';
import logo from './Images/Logo-miracle.png'
import { FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Memoize the logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    setUserMenuOpen(false);
    navigate('/');
  }, [setUser, navigate]);

  // Toggle dashboard visibility
  const toggleDashboard = useCallback(() => {
    setDashboardOpen(prevState => !prevState);
  }, []);

  // Toggle user menu visibility
  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen(prevState => !prevState);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
            
            {!user ? (
              <li><Link to="/signup">Register</Link></li>
            ) : (
              <>
                {user.role && ROLE_DASHBOARD_LINKS[user.role] && (
                  <li>
                    <Link to="#" onClick={toggleDashboard}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                    </Link>
                  </li>
                )}
                <li className="user-menu-container" ref={userMenuRef}>
                  <div 
                    className="user-profile-button" 
                    onClick={toggleUserMenu}
                  >
                    <FaUserCircle className="user-icon" />
                    <span>{user.username}</span>
                  </div>
                  
                  {userMenuOpen && (
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <Link to="/profile">
                            <FaUser className="menu-icon" /> Profile
                          </Link>
                        </li>
                        <li>
                          <button onClick={handleLogout} className="dropdown-button">
                            <FaSignOutAlt className="menu-icon" /> Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </>
            )}
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