import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Components/Profile/Signup';
import Login from './Components/Profile/Login';
import StudentDashboard from './Components/Student/StudentDashboard';
import FacultyDashboard from './Components/Faculty/FacultyDashboard';
import AdminDashboard from './Components/Admin/AdminDashboard';
import About from './Components/About/About'
import Home from './Components/Home/Home';
import Explore from './Components/Explore/Explore';
import { UserProvider } from './Components/UserContext';
import { AuthLayout, PublicLayout } from './Components/Layout';
import './Components/Layout.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore/*" element={<Explore />} />
          </Route>
          
          {/* Protected Routes with Role-Based Access */}
          <Route path="/student" element={<AuthLayout requiredRole="student" />}>
            <Route index element={<StudentDashboard />} />
            {/* Add more student routes here */}
          </Route>
          
          <Route path="/faculty" element={<AuthLayout requiredRole="faculty" />}>
            <Route index element={<FacultyDashboard />} />
            {/* Add more faculty routes here */}
          </Route>
          
          <Route path="/admin" element={<AuthLayout requiredRole="admin" />}>
            <Route index element={<AdminDashboard />} />
            {/* Add more admin routes here */}
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;