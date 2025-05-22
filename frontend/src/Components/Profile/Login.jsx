import React, { useState, useContext, useEffect } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './LoadingAnimation.css';
import './EnhancedFormAnimation.css';
import './ModernLoginForm.css';
import { UserContext } from '../UserContext';
import { FaUser, FaLock, FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaArrowRight } from 'react-icons/fa';
import LoadingAnimation from './LoadingAnimation.jsx';
import EnhancedFormAnimation from './EnhancedFormAnimation.jsx';
import ModernLoginForm from './ModernLoginForm.jsx';

const Login = () => {
  const [loginStep, setLoginStep] = useState('loading');
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '',
    enrollment_id: '',
    date_of_birth: '',
    role: 'faculty'
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Auto-transition from loading to role selection after 3 seconds
  useEffect(() => {
    if (loginStep === 'loading') {
      const timer = setTimeout(() => {
        setLoginStep('roleSelection');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginStep]);

  // Navigate after successful login animation completes
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        const role = localStorage.getItem('role');
        if (role === 'student') navigate('/student');
        else if (role === 'faculty') navigate('/faculty');
        else if (role === 'admin') navigate('/admin');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, navigate]);

  const handleChange = e => setCredentials({ 
    ...credentials, 
    [e.target.name]: e.target.value 
  });

  const handleRoleSelection = role => {
    setSelectedRole(role);
    setCredentials({ ...credentials, role });
    setLoginStep('loginForm');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let res;
      
      if (selectedRole === 'student') {
        res = await axios.post('student-login/', {
          enrollment_id: credentials.enrollment_id,
          date_of_birth: credentials.date_of_birth
        });
      } else {
        res = await axios.post('login/', {
          username: credentials.username,
          password: credentials.password
        });
      }
      
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('role', res.data.user.role);
      
      setUser({ 
        role: res.data.user.role, 
        username: selectedRole === 'student' ? res.data.user.username : credentials.username 
      });

      // Show success animation instead of navigating immediately
      setLoginSuccess(true);
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  // Success animation screen
  if (loginSuccess) {
    return (
      <div className="login-step success-step">
        <div className="success-animation-container">
          <div className="success-icon">
            <svg viewBox="0 0 52 52" className="checkmark">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <div className="success-text">
            <h2>Login Successful!</h2>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading animation screen with custom animation
  if (loginStep === 'loading') {
    return (
      <div className="login-step loading-step">
        <div className="loading-animation-container">
          <LoadingAnimation />
          <div className="loading-text">
            <h2>Welcome to Miracle Academy</h2>
            <p>Opening secure portal...</p>
          </div>
        </div>
      </div>
    );
  }

  // Role selection screen
  if (loginStep === 'roleSelection') {
    return (
      <div className="login-step role-selection-step">
        <div className="role-selection-container">
          <div className="role-selection-header">
            <h1>Choose Your Role</h1>
            <p>Select how you want to access the platform</p>
          </div>
          
          <div className="role-cards">
            <div className="role-card admin" onClick={() => handleRoleSelection('admin')}>
              <div className="role-card-bg"></div>
              <div className="role-card-face role-card-front">
                <div className="role-icon-wrapper">
                  <div className="role-icon">
                    <FaUserShield />
                  </div>
                </div>
                <h3>Admin</h3>
                <p>System administration and management</p>
                <div className="role-card-footer">
                  <span>Select <FaArrowRight /></span>
                </div>
              </div>
              <div className="role-card-face role-card-back"></div>
            </div>
            
            <div className="role-card faculty" onClick={() => handleRoleSelection('faculty')}>
              <div className="role-card-bg"></div>
              <div className="role-card-face role-card-front">
                <div className="role-icon-wrapper">
                  <div className="role-icon">
                    <FaChalkboardTeacher />
                  </div>
                </div>
                <h3>Faculty</h3>
                <p>Course management and student assessment</p>
                <div className="role-card-footer">
                  <span>Select <FaArrowRight /></span>
                </div>
              </div>
              <div className="role-card-face role-card-back"></div>
            </div>
            
            <div className="role-card student" onClick={() => handleRoleSelection('student')}>
              <div className="role-card-bg"></div>
              <div className="role-card-face role-card-front">
                <div className="role-icon-wrapper">
                  <div className="role-icon">
                    <FaUserGraduate />
                  </div>
                </div>
                <h3>Student</h3>
                <p>Access courses and track progress</p>
                <div className="role-card-footer">
                  <span>Select <FaArrowRight /></span>
                </div>
              </div>
              <div className="role-card-face role-card-back"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login form screen
  return (
    <div className="login-fullscreen">
      <div className="login-background">
        <div className="login-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
        
        <div className="login-content">
          <div className="login-left-panel">
            <div className="login-logo">
              <h1>Miracle <span>Academy</span></h1>
            </div>
            <div className="login-animation">
              <EnhancedFormAnimation selectedRole={selectedRole} />
            </div>
            <div className="login-tagline">
              <h2>Transform Your Future</h2>
              <p>Join our community of learners and achieve your goals</p>
            </div>
          </div>
          
          <div className="login-right-panel">
            <ModernLoginForm 
              selectedRole={selectedRole}
              credentials={credentials}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              setLoginStep={setLoginStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;