import React, { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Navbar.css';
import logo from './Images/Logo-miracle.png'
import { FaSignOutAlt, FaUserCircle, FaGlobe } from 'react-icons/fa';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Memoize the logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    setUserMenuOpen(false);
    navigate('/login');
  }, [setUser, navigate]);

  // Handle Web button click - logs out and redirects to home
  const handleWebClick = useCallback(() => {
    // First navigate to home page
    navigate('/');
    // Then perform logout actions
    setTimeout(() => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
    }, 100);
  }, [setUser, navigate]);

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

  return (
    <>
      <nav className={`navbar ${user ? 'logged-in' : ''}`}>
        {!user ? (
          // Non-logged in navbar
          <>
            <div className="nav-left">
              <img src={logo} alt="Miracle Logo" />
            </div>
            <div className="nav-right">
              <ul className="nav-list">
                <li><Link to="/explore">Explore</Link></li>
                <li><Link to="/signup">Register</Link></li>
              </ul>
            </div>
          </>
        ) : (
          // Logged in navbar
          <>
            <div className="nav-center logged-in-center">
              <span className="academy-title">Miracle IT Career Academy</span>
            </div>
            <div className="nav-right">
              <ul className="nav-list">
                <li>
                  <button onClick={handleWebClick} className="web-link">
                    <FaGlobe className="web-icon" /> Web
                  </button>
                </li>
                <li className="user-menu-container" ref={userMenuRef}>
                  <div 
                    className="user-profile-button" 
                    onClick={toggleUserMenu}
                  >
                    <FaUserCircle className="user-icon" />
                    <span className="username">{user.username}</span>
                  </div>
                  
                  {userMenuOpen && (
                    <div className="dropdown-menu">
                      <ul>
                        <li>
                          <button onClick={handleLogout} className="dropdown-button">
                            <FaSignOutAlt className="menu-icon" /> Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default React.memo(Navbar);