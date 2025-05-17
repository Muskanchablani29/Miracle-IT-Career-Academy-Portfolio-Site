import React, { useState, useContext } from 'react';
import axios from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { UserContext } from '../UserContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = e => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', credentials);
      const res = await axios.post('login/', credentials);
      console.log('Login response:', res.data);
      
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      
      // Re-create axios instance with the new token
      const token = res.data.access;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      console.log('Fetching profile with token');
      const profile = await axios.get('profile/', config);
      console.log('Profile response:', profile.data);
      
      const role = profile.data.role;
      localStorage.setItem('role', role); // Store role in localStorage
      setUser({ role, username: credentials.username });

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
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
      <p>Don't have an account? <Link to="/signup">Signup here</Link></p>
    </form>
  );
};

export default Login;