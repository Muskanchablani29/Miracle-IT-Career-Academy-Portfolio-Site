import React, { useState, useEffect } from 'react';
import { getStudentProfile, updateStudentProfile, userAxiosInstance } from '../../api';
import './StudentProfile.css';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, dashboardData] = await Promise.all([
        getStudentProfile(),
        fetchDashboardData()
      ]);
      setProfileData(profileData);
      setDashboardData(dashboardData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await userAxiosInstance.get('student-dashboard/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return null;
    }
  };



  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'ST';
  };

  const calculateProfileCompletion = (profile, student) => {
    if (!profile || !student) return 0;
    
    let completed = 0;
    const total = 5;
    
    if (profile.first_name && profile.last_name) completed++;
    if (student.enrollment_id) completed++;
    if (profile.email) completed++;
    if (student.course) completed++;
    if (student.date_of_birth) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="student-profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-profile-container">
        <div className="profile-error">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Profile</h3>
          <p>{error}</p>
          <button onClick={fetchProfileData} className="btn-retry">
            <i className="icon-refresh"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="student-profile-container">
        <div className="profile-error">
          <div className="error-icon">👤</div>
          <h3>Profile Not Found</h3>
          <p>We couldn't find your profile information. Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  const student = profileData.student_profile;
  const completionPercentage = calculateProfileCompletion(profileData, student);

  return (
    <div className="student-profile-container">
      {/* Modern Header Section */}
      <div className="profile-header-section">
        <div className="profile-banner">
          <div className="banner-gradient"></div>
        </div>
        
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <span className="avatar-initials">
                {getInitials(profileData.first_name, profileData.last_name)}
              </span>
              <div className="avatar-status-indicator"></div>
            </div>
          </div>
          
          <div className="profile-header-info">
            <h1 className="profile-name">
              {profileData.first_name} {profileData.last_name}
            </h1>
            <p className="profile-role">🎓 Student Dashboard</p>
            <div className="profile-meta">
              <span className="meta-item">
                <i className="icon-id"></i>
                ID: {student?.enrollment_id || 'Not assigned'}
              </span>
              <span className="meta-item">
                <i className="icon-calendar"></i>
                Joined: {formatDate(student?.admission_date)}
              </span>
              <span className="meta-item">
                <i className="icon-academic"></i>
                {student?.course?.title || 'Not enrolled'}
              </span>
            </div>
          </div>
          

        </div>
      </div>

      <div className="profile-content">
        <div className="profile-grid">
          {/* Personal Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h3>
                <i className="icon-user"></i>
                Personal Information
              </h3>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{profileData.first_name} {profileData.last_name}</p>
                </div>
                <div className="info-item">
                  <label>Username</label>
                  <p>{profileData.username}</p>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{profileData.email || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{formatDate(student?.date_of_birth)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h3>
                <i className="icon-academic"></i>
                Academic Information
              </h3>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Student ID</label>
                  <p className="highlight-text">{student?.enrollment_id || 'Not assigned'}</p>
                </div>
                <div className="info-item">
                  <label>Course</label>
                  <p>{student?.course?.title || 'Not enrolled'}</p>
                </div>
                <div className="info-item">
                  <label>Batch</label>
                  <p>{student?.batch?.name || 'Not assigned'}</p>
                </div>
                <div className="info-item">
                  <label>Admission Date</label>
                  <p>{formatDate(student?.admission_date)}</p>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Modern Bottom Section */}
        <div className="bottom-section-grid">
          <div className="recent-activity-card">
            <div className="card-header">
              <h3>
                <i className="icon-activity"></i>
                ⚡ Recent Activity
              </h3>
            </div>
            <div className="card-content">
              <div className="activity-list">
                {dashboardData?.stats?.is_present_today && (
                  <div className="activity-item">
                    <div className="activity-icon present">✓</div>
                    <div className="activity-content">
                      <p className="activity-title">Marked Present Today</p>
                      <p className="activity-time">Today • Just now</p>
                    </div>
                  </div>
                )}
                <div className="activity-item">
                  <div className="activity-icon enrollment">📚</div>
                  <div className="activity-content">
                    <p className="activity-title">Course Enrollment Completed</p>
                    <p className="activity-time">{formatDate(student?.admission_date)}</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon project">🚀</div>
                  <div className="activity-content">
                    <p className="activity-title">Latest Project Submitted</p>
                    <p className="activity-time">2 days ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon" style={{background: 'linear-gradient(135deg, #64748b, #475569)'}}>👋</div>
                  <div className="activity-content">
                    <p className="activity-title">Welcome to the Platform</p>
                    <p className="activity-time">Profile created successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="completion-card">
            <div className="completion-header">
              <h3>🎯 Profile Completion</h3>
              <span 
                className="completion-percentage"
                style={{
                  background: getCompletionColor(completionPercentage)
                }}
              >
                {completionPercentage}%
              </span>
            </div>
            <div className="completion-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${completionPercentage}%`,
                    background: getCompletionColor(completionPercentage)
                  }}
                ></div>
              </div>
            </div>
            <div className="completion-tips">
              <p>🚀 Complete your profile to unlock all premium features:</p>
              <ul>
                <li className={profileData?.first_name && profileData?.last_name ? 'completed' : 'pending'}>
                  {profileData?.first_name && profileData?.last_name ? '✅' : '⭕'} Basic Information
                </li>
                <li className={student?.enrollment_id ? 'completed' : 'pending'}>
                  {student?.enrollment_id ? '✅' : '⭕'} Academic Details
                </li>
                <li className={profileData?.email ? 'completed' : 'pending'}>
                  {profileData?.email ? '✅' : '⭕'} Contact Information
                </li>
                <li className={student?.course ? 'completed' : 'pending'}>
                  {student?.course ? '✅' : '⭕'} Course Enrollment
                </li>
                <li className={student?.date_of_birth ? 'completed' : 'pending'}>
                  {student?.date_of_birth ? '✅' : '⭕'} Personal Details
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;