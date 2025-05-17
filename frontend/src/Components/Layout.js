import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Layout for public pages - no special styling
export const PublicLayout = () => {
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
  
  // Check if user is authenticated and has the required role
  const isAuthenticated = localStorage.getItem('access') !== null;
  const userRole = localStorage.getItem('role');
  
  console.log('AuthLayout - isAuthenticated:', isAuthenticated);
  console.log('AuthLayout - userRole:', userRole);
  console.log('AuthLayout - requiredRole:', requiredRole);
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    console.log('Wrong role, redirecting to home');
    return <Navigate to="/" replace />;
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