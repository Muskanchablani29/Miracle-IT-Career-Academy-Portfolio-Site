import React, { useState, useContext } from 'react';
import axios from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { UserContext } from '../UserContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '',
    enrollment_id: '',
    date_of_birth: '',
    role: 'faculty' // Default role
  });
  const [selectedRole, setSelectedRole] = useState('faculty');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = e => setCredentials({ 
    ...credentials, 
    [e.target.name]: e.target.value 
  });

  const handleRoleChange = e => {
    setSelectedRole(e.target.value);
    setCredentials({ 
      ...credentials, 
      role: e.target.value 
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      let res;
      
      if (selectedRole === 'student') {
        // Student login with enrollment ID and password (DOB)
        console.log('Attempting student login with:', {
          enrollment_id: credentials.enrollment_id,
          date_of_birth: credentials.date_of_birth
        });
        
        // Format password if it's in DDMMYYYY format
        let dateOfBirth = credentials.date_of_birth;
        
        res = await axios.post('student-login/', {
          enrollment_id: credentials.enrollment_id,
          date_of_birth: dateOfBirth
        });
      } else {
        // Admin or Faculty login with username and password
        console.log('Attempting login with:', {
          username: credentials.username,
          password: credentials.password
        });
        
        res = await axios.post('login/', {
          username: credentials.username,
          password: credentials.password
        });
      }
      
      console.log('Login response:', res.data);
      
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      
      // Get user role from response
      const role = res.data.user.role;
      localStorage.setItem('role', role);
      
      // Set user in context
      setUser({ 
        role, 
        username: selectedRole === 'student' 
          ? res.data.user.username 
          : credentials.username 
      });

      // Navigate based on role
      if (role === 'student') navigate('/student');
      else if (role === 'faculty') navigate('/faculty');
      else if (role === 'admin') navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data) {
        console.error('Error response data:', err.response.data);
        alert('Login failed: ' + JSON.stringify(err.response.data));
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      
      <div className="role-selector">
        <label>
          <input 
            type="radio" 
            name="roleSelector" 
            value="admin" 
            checked={selectedRole === 'admin'}
            onChange={handleRoleChange} 
          />
          Admin
        </label>
        <label>
          <input 
            type="radio" 
            name="roleSelector" 
            value="faculty" 
            checked={selectedRole === 'faculty'}
            onChange={handleRoleChange} 
          />
          Faculty
        </label>
        <label>
          <input 
            type="radio" 
            name="roleSelector" 
            value="student" 
            checked={selectedRole === 'student'}
            onChange={handleRoleChange} 
          />
          Student
        </label>
      </div>
      
      {selectedRole !== 'student' ? (
        // Admin and Faculty login form
        <>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username"
              name="username" 
              placeholder="Enter your username" 
              value={credentials.username}
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange} 
              required 
            />
          </div>
        </>
      ) : (
        // Student login form
        <>
          <div className="form-group">
            <label htmlFor="enrollment_id">Enrollment ID</label>
            <input 
              type="text" 
              id="enrollment_id"
              name="enrollment_id" 
              placeholder="Enter your enrollment ID" 
              value={credentials.enrollment_id}
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="date_of_birth" 
              placeholder="Enter your password (DOB format: DDMMYYYY)"
              value={credentials.date_of_birth}
              onChange={handleChange} 
              required 
            />
          </div>
        </>
      )}
      
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;