import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <h2>Explore</h2>
      <ul className="sidebar-menu">
        <li className={location.pathname === "/explore/certificates" ? "active" : ""}>
          <Link to="/explore/certificates">Earn a Certificate</Link>
        </li>
        <li className={location.pathname === "/explore/workshops" ? "active" : ""}>
          <Link to="/explore/workshops">Attend a Workshop</Link>
        </li>
        <li className={location.pathname === "/explore/quizzes" ? "active" : ""}>
          <Link to="/explore/quizzes">Take Quiz</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;