import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

// Layout for public pages - no special styling
export const PublicLayout = () => {
  const { user } = useContext(UserContext);
  
  // If user is already logged in, redirect to their dashboard
  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

// Layout for authenticated pages with role-based access control
export const AuthLayout = ({ requiredRole }) => {
  const location = useLocation();
  const { user, loading } = useContext(UserContext);
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user doesn't have the required role, redirect to their dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return (
    <div className="auth-layout">
      <Navbar />
      <Sidebar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};