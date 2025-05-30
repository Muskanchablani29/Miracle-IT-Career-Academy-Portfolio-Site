import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Explore from './Components/Explore/Explore';
import WorkshopDetails from './Components/Explore/WorkshopDetails';
import { UserContext } from './Components/UserContext';
import { userAxiosInstance, adminAxiosInstance } from './api';
import AdminDashboard from './Components/Admin/AdminDashboard';
import FacultyDashboard from './Components/Faculty/FacultyDashboard';
import StudentDashboard from './Components/Student/StudentDashboard';
import CourseManagement from './Components/Admin/CourseManagement';
import SyllabusEditor from './Components/Admin/SyllabusEditor';
import Login from './Components/Profile/Login';
import Signup from './Components/Profile/Signup';
import Home from './Components/Home/Home';
import { AuthLayout, PublicLayout } from './Components/Layout';

// Admin components
import UserManagement from './Components/Admin/UserManagement';
import AttendanceLogs from './Components/Admin/AttendanceLogs';
import FeeTracking from './Components/Admin/FeeTracking';
import AdminCertificates from './Components/Admin/Certificates';
import SystemSettings from './Components/Admin/SystemSettings';
import AddCourse from './Components/Admin/AddCourse';
import AddWorkshop from './Components/Admin/AddWorkshop';
import WorkshopRegistrations from './Components/Admin/WorkshopRegistrations';

// Faculty components
import ManageCourses from './Components/Faculty/ManageCourses';
import FacultyStudentAttendance from './Components/Faculty/StudentAttendance';
import Gradebook from './Components/Faculty/Gradebook';
import FacultyAnnouncements from './Components/Faculty/FacultyAnnouncements';
import StudentList from './Components/Faculty/StudentList';

// Student components
import StudentCourses from './Components/Student/StudentCourses';
import StudentAttendanceRecord from './Components/Student/StudentAttendance';
import StudentPerformance from './Components/Student/StudentPerformance';
import StudentFees from './Components/Student/StudentFees';
import StudentDocuments from './Components/Student/StudentDocuments';
import StudentProfile from './Components/Student/StudentProfile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access');
    if (token) {
      // Fetch user profile
      userAxiosInstance.get('profile/')
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Signup />} />
            </Route>
            
            <Route path="/explore/*" element={<><Navbar /><Explore /></>} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AuthLayout requiredRole="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="add-workshop" element={<AddWorkshop />} />
              <Route path="courses/:courseId/syllabus" element={<SyllabusEditor />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="attendance" element={<AttendanceLogs />} />
              <Route path="fees" element={<FeeTracking />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="workshop-registrations" element={<WorkshopRegistrations />} />
            </Route>
            
            {/* Faculty routes */}
            <Route path="/faculty" element={<AuthLayout requiredRole="faculty" />}>
              <Route index element={<FacultyDashboard />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="add-workshop" element={<AddWorkshop />} />
              <Route path="courses/:courseId/syllabus" element={<SyllabusEditor />} />
              <Route path="attendance" element={<FacultyStudentAttendance />} />
              <Route path="gradebook" element={<Gradebook />} />
              <Route path="announcements" element={<FacultyAnnouncements />} />
              <Route path="students" element={<StudentList />} />
              <Route path="workshop-registrations" element={<WorkshopRegistrations />} />
            </Route>
            
            {/* Student routes */}
            <Route path="/student" element={<AuthLayout requiredRole="student" />}>
              <Route index element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="attendance" element={<StudentAttendanceRecord />} />
              <Route path="performance" element={<StudentPerformance />} />
              <Route path="fees" element={<StudentFees />} />
              <Route path="documents" element={<StudentDocuments />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;