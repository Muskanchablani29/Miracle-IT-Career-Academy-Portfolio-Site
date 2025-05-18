import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext, UserProvider } from './Components/UserContext';
import { AuthLayout, PublicLayout } from './Components/Layout';
import Login from './Components/Profile/Login';
import Signup from './Components/Profile/Signup';
import Home from './Components/Home/Home';
import About from './Components/About/About';

// Student Components
import StudentDashboard from './Components/Student/StudentDashboard';
import StudentCourses from './Components/Student/StudentCourses';
import StudentAttendance from './Components/Student/StudentAttendance';
import StudentPerformance from './Components/Student/StudentPerformance';
import StudentFees from './Components/Student/StudentFees';
import StudentDocuments from './Components/Student/StudentDocuments';
import StudentProfile from './Components/Student/StudentProfile';

// Admin Components
import AdminDashboard from './Components/Admin/AdminDashboard';
import UserManagement from './Components/Admin/UserManagement';
import CourseManagement from './Components/Admin/CourseManagement';
import AttendanceLogs from './Components/Admin/AttendanceLogs';
import FeeTracking from './Components/Admin/FeeTracking';
import Certificates from './Components/Admin/Certificates';
import SystemSettings from './Components/Admin/SystemSettings';

// Faculty Components
import FacultyDashboard from './Components/Faculty/FacultyDashboard';
import ManageCourses from './Components/Faculty/ManageCourses';
import StudentAttendanceFaculty from './Components/Faculty/StudentAttendance';
import Gradebook from './Components/Faculty/Gradebook';
import FacultyAnnouncements from './Components/Faculty/FacultyAnnouncements';
import StudentList from './Components/Faculty/StudentList';

// Explore Components
import Explore from './Components/Explore/Explore';
import CoursesMain from './Components/Explore/CoursesMain';
import CourseDetail from './Components/Explore/CourseDetail';

import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="explore" element={<Explore />} />
            <Route path="courses" element={<CoursesMain />} />
            <Route path="course/:id" element={<CourseDetail />} />
          </Route>
          
          {/* Student Routes */}
          <Route path="student" element={<AuthLayout requiredRole="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="performance" element={<StudentPerformance />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="documents" element={<StudentDocuments />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="admin" element={<AuthLayout requiredRole="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="attendance" element={<AttendanceLogs />} />
            <Route path="fees" element={<FeeTracking />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
          
          {/* Faculty Routes */}
          <Route path="faculty" element={<AuthLayout requiredRole="faculty" />}>
            <Route index element={<FacultyDashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="attendance" element={<StudentAttendanceFaculty />} />
            <Route path="gradebook" element={<Gradebook />} />
            <Route path="announcements" element={<FacultyAnnouncements />} />
            <Route path="students" element={<StudentList />} />
          </Route>
          
          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;