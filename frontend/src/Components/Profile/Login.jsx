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
      const res = await axios.post('login/', credentials);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      const profile = await axios.get('profile/');
      const role = profile.data.role;

      setUser({ role, username: credentials.username });

      if (role === 'student') navigate('/student');
      else if (role === 'faculty') navigate('/faculty');
      else if (role === 'admin') navigate('/admin');
    } catch (err) {
      if (err.response && err.response.data) {
        alert('Login failed: ' + JSON.stringify(err.response.data));
      } else {
        alert('Login failed');
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
