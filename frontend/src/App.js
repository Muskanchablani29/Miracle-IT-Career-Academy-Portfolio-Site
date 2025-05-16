import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Components/Profile/Signup';
import Login from './Components/Profile/Login';
import StudentDashboard from './Components/Pages/StudentDashboard';
import FacultyDashboard from './Components/Pages/FacultDashboard';
import AdminDashboard from './Components/Pages/AdminDashboard';
import About from './Components/About/About'
import MainPage from './Components/Pages/MainPage';
import Home from './Components/Home/Home';
import Explore from './Components/Explore/Explore';
import Navbar from './Components/Navbar';
import { UserProvider } from './Components/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/explore/*" element={<Explore />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;