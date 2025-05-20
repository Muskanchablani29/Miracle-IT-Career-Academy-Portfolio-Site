import React, { useState, useContext, useEffect } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from './loadingAnimation.json';
import roleSelectionAnimation from './roleSelectionAnimation.json';
import loginAnimation from './loginAnimation.json';
import './Login.css';
import { UserContext } from '../UserContext';
import { FaUser, FaLock, FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';

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
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Auto-transition from loading to role selection after 5 seconds
  useEffect(() => {
    if (loginStep === 'loading') {
      const timer = setTimeout(() => {
        setLoginStep('roleSelection');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginStep]);

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

      if (res.data.user.role === 'student') navigate('/student');
      else if (res.data.user.role === 'faculty') navigate('/faculty');
      else if (res.data.user.role === 'admin') navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  const handleDirectLogin = async (role) => {
    const loginData = role === 'admin' 
      ? { username: 'admin', password: 'admin123' }
      : role === 'faculty'
        ? { username: 'faculty', password: 'faculty123' }
        : { enrollment_id: 'STUDENT001', date_of_birth: '01012000' };
    
    try {
      const res = await axios.post(
        role === 'student' ? 'student-login/' : 'login/', 
        loginData
      );
      
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('role', res.data.user.role);
      
      setUser({ 
        role: res.data.user.role, 
        username: res.data.user.username 
      });

      if (res.data.user.role === 'student') navigate('/student');
      else if (res.data.user.role === 'faculty') navigate('/faculty');
      else if (res.data.user.role === 'admin') navigate('/admin');
    } catch (err) {
      console.error('Direct login error:', err);
      alert('Login failed. Please try again.');
    }
  };

  // Loading animation screen
  if (loginStep === 'loading') {
    return (
      <div className="login-step loading-step">
        <div className="loading-animation">
          <Lottie animationData={loadingAnimation} loop={true} />
          <h2>Preparing Login...</h2>
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
            <p>Select your role to continue</p>
          </div>
          
          <div className="role-animation">
            <Lottie animationData={roleSelectionAnimation} loop={true} />
          </div>
          
          <div className="role-cards">
            <div className="role-card admin" onClick={() => handleRoleSelection('admin')}>
              <div className="role-icon">
                <FaUserShield />
              </div>
              <h3>Admin</h3>
              <p>System administration and management</p>
            </div>
            
            <div className="role-card faculty" onClick={() => handleRoleSelection('faculty')}>
              <div className="role-icon">
                <FaChalkboardTeacher />
              </div>
              <h3>Faculty</h3>
              <p>Course management and student assessment</p>
            </div>
            
            <div className="role-card student" onClick={() => handleRoleSelection('student')}>
              <div className="role-icon">
                <FaUserGraduate />
              </div>
              <h3>Student</h3>
              <p>Access courses and track progress</p>
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
              <Lottie animationData={loginAnimation} loop={true} />
            </div>
            <div className="login-tagline">
              <h2>Transform Your Future</h2>
              <p>Join our community of learners and achieve your goals</p>
            </div>
          </div>
          
          <div className="login-right-panel">
            <div className="login-form-container">
              <h2>Welcome Back</h2>
              <p>Please login as {selectedRole}</p>
              
              <div className="selected-role">
                <div className={`role-badge ${selectedRole}`}>
                  {selectedRole === 'admin' && <FaUserShield />}
                  {selectedRole === 'faculty' && <FaChalkboardTeacher />}
                  {selectedRole === 'student' && <FaUserGraduate />}
                  <span>{selectedRole}</span>
                </div>
                <button className="change-role-btn" onClick={() => setLoginStep('roleSelection')}>
                  Change Role
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                {selectedRole !== 'student' ? (
                  <>
                    <div className="form-input">
                      <FaUser className="input-icon" />
                      <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={credentials.username}
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-input">
                      <FaLock className="input-icon" />
                      <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={credentials.password}
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-input">
                      <FaUser className="input-icon" />
                      <input 
                        type="text" 
                        name="enrollment_id" 
                        placeholder="Enrollment ID" 
                        value={credentials.enrollment_id}
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    
                    <div className="form-input">
                      <FaLock className="input-icon" />
                      <input 
                        type="password" 
                        name="date_of_birth" 
                        placeholder="Password (DOB: DDMMYYYY)" 
                        value={credentials.date_of_birth}
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </>
                )}
                
                <button type="submit" className="login-submit-btn">Login</button>
              </form>
              
              <div className="quick-access">
                <p>Quick Access:</p>
                <div className="quick-access-buttons">
                  <button onClick={() => handleDirectLogin(selectedRole)} className={`quick-btn ${selectedRole}`}>
                    Login as {selectedRole}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;