import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'
import './StudentDashboard.css'
import { 
  FaSearch, FaBell, FaBook, FaCalendarCheck, FaMoneyBillWave, 
  FaGraduationCap, FaTrophy, FaChartLine, FaClipboardList,
  FaUserGraduate, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaCalendar, FaBookOpen, FaAward, FaProjectDiagram, FaPlay,
  FaStar, FaFire, FaRocket, FaLightbulb, FaBullseye, FaGem,
  FaArrowRight, FaGraduationCap as FaGrad, FaUsers, FaChevronRight,
  FaMagic, FaBullseye as FaTarget, FaAward as FaMedal, FaBookmark, FaHeart,
  FaLayerGroup, FaAtom, FaFeather, FaCompass, FaDiamond, FaTasks, FaUser
} from 'react-icons/fa' 
import { 
  fetchCourseUpdateNotifications, getUserEnrollments, checkAttendanceStatus, 
  getStudentFeeDetails, userAxiosInstance, getStudentDashboardData, fetchStudentAnnouncements,
  fetchStudentNotifications, fetchMyEnrollments 
} from '../../api'
import ChatWidget from '../Chatbot/ChatWidget'
import LoadingDashboard from './LoadingDashboard'
import DashboardErrorBoundary from './DashboardErrorBoundary'
import { useNotification } from './NotificationToast'


export default function StudentDashboard() {
  const { user } = useContext(UserContext);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({ is_present: false });
  const [feeStatus, setFeeStatus] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    completedAssignments: 0,
    attendancePercentage: 0,
    upcomingDeadlines: 0,
    achievements: 0,
    projectsSubmitted: 0
  });
  const [courseProgress, setCourseProgress] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { addNotification, NotificationContainer } = useNotification();

  const [courseVideos, setCourseVideos] = useState({});

  // Function to get video status based on index
  const getVideoStatus = (videoIndex) => {
    const maxWatchedVideos = 8;
    
    if (videoIndex < maxWatchedVideos - 2) {
      // Completed videos (first 6)
      return { progress: 100, status: 'completed', unlocked: true };
    } else if (videoIndex === maxWatchedVideos - 2) {
      // Currently watching (7th video)
      return { progress: 65, status: 'watching', unlocked: true };
    } else if (videoIndex === maxWatchedVideos - 1) {
      // Next video (8th video)
      return { progress: 0, status: 'next', unlocked: true };
    } else {
      // Locked videos (9th onwards)
      return { progress: 0, status: 'locked', unlocked: false };
    }
  };

  // Function to calculate course progress percentage
  const calculateCourseProgress = (videos) => {
    if (!videos || videos.length === 0) return 0;
    
    const completedVideos = 6; // First 6 are completed
    const currentVideoProgress = 0.65; // 7th video is 65% watched
    
    const totalProgress = completedVideos + currentVideoProgress;
    const percentage = (totalProgress / videos.length) * 100;
    
    return Math.round(percentage * 10) / 10; // Round to 1 decimal
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchIndividualData();
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    
    const fetchIndividualData = async () => {
      console.log('=== FETCHING DASHBOARD DATA ===');
      
      // Fetch real enrollments with progress
      try {
        console.log('Fetching my enrollments with progress...');
        const enrollmentsData = await fetchMyEnrollments();
        console.log('Enrollments data:', enrollmentsData);
        
        if (enrollmentsData && Array.isArray(enrollmentsData) && enrollmentsData.length > 0) {
          setEnrollments(enrollmentsData);
          setDashboardStats(prev => ({ ...prev, totalCourses: enrollmentsData.length }));
          
          // Calculate course progress for each enrollment
          const progressData = {};
          enrollmentsData.forEach(enrollment => {
            progressData[enrollment.course] = {
              courseName: enrollment.course_title || 'Course',
              instructor: enrollment.instructor_name || 'Instructor',
              progress: enrollment.progress_percentage || 0,
              completedVideos: enrollment.completed_videos || 0,
              totalVideos: enrollment.total_videos || 10,
              nextVideo: enrollment.next_lesson || 'Start Learning',
              lastWatched: enrollment.last_accessed ? new Date(enrollment.last_accessed).toLocaleDateString() : 'Never',
              courseImage: enrollment.course_image
            };
          });
          setCourseProgress(progressData);
        } else {
          setEnrollments([]);
          setDashboardStats(prev => ({ ...prev, totalCourses: 0 }));
        }
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        // Fallback to old API
        try {
          const response = await userAxiosInstance.get('courses/user-enrollments/');
          if (response.data && Array.isArray(response.data)) {
            setEnrollments(response.data);
            setDashboardStats(prev => ({ ...prev, totalCourses: response.data.length }));
          }
        } catch (fallbackErr) {
          console.error('Fallback enrollment API also failed:', fallbackErr);
          setEnrollments([]);
        }
      }

      try {
        const attendanceData = await checkAttendanceStatus();
        setAttendanceStatus(attendanceData || { is_present: false });
        
        // Fetch attendance percentage
        const attendanceStats = await userAxiosInstance.get('attendance/my_attendance/');
        if (attendanceStats.data?.statistics) {
          setDashboardStats(prev => ({
            ...prev,
            attendancePercentage: attendanceStats.data.statistics.attendance_percentage || 0
          }));
        }
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setAttendanceStatus({ is_present: false });
      }
      
      // Fetch fee data
      try {
        const feeData = await getStudentFeeDetails();
        setFeeStatus({
          total: feeData.total_amount || 0,
          paid: feeData.amount_paid || 0,
          due: feeData.due_amount || 0,
          status: feeData.fee_details?.status || 'unknown'
        });
      } catch (err) {
        console.error('Error fetching fee details:', err);
        setFeeStatus({ total: 0, paid: 0, due: 0, status: 'unknown' });
      }
      
      // Fetch announcements and notifications
      try {
        const announcementsData = await fetchStudentAnnouncements();
        setAnnouncements(announcementsData || []);
        
        // Fetch additional notifications
        const notificationsData = await fetchStudentNotifications();
        if (notificationsData && notificationsData.length > 0) {
          // Convert notifications to announcement format for display
          const notificationAnnouncements = notificationsData.slice(0, 5).map(notification => ({
            id: `notif_${notification.id}`,
            title: notification.title || 'System Notification',
            message: notification.message || notification.content || '',
            priority: notification.priority || 'normal',
            course_title: notification.course_title || 'System',
            created_at: notification.created_at || new Date().toISOString(),
            created_by_name: 'System',
            type: 'notification'
          }));
          
          // Add some sample notifications for better UX
          const sampleNotifications = [
            {
              id: 'sample_1',
              title: 'Welcome to Your Learning Journey!',
              message: 'Complete your profile and start exploring courses to unlock achievements.',
              priority: 'important',
              course_title: 'All Courses',
              created_at: new Date().toISOString(),
              created_by_name: 'Academy',
              type: 'notification'
            },
            {
              id: 'sample_2', 
              title: 'New Project Assignments Available',
              message: 'Check out the latest project assignments in your enrolled courses.',
              priority: 'normal',
              course_title: 'All Courses',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              created_by_name: 'Faculty',
              type: 'notification'
            }
          ];
          
          // Combine announcements with notifications
          const combinedAnnouncements = [...(announcementsData || []), ...notificationAnnouncements, ...sampleNotifications];
          setAnnouncements(combinedAnnouncements.slice(0, 10)); // Limit to 10 items
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        // Set sample announcements if API fails
        setAnnouncements([
          {
            id: 'sample_1',
            title: 'Welcome to Your Learning Journey!',
            message: 'Complete your profile and start exploring courses to unlock achievements.',
            priority: 'important',
            course_title: 'All Courses',
            created_at: new Date().toISOString(),
            created_by_name: 'Academy',
            type: 'notification'
          },
          {
            id: 'sample_2',
            title: 'Assignment Deadline Reminder',
            message: 'Don\'t forget to submit your pending assignments before the deadline.',
            priority: 'urgent',
            course_title: 'All Courses',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            created_by_name: 'System',
            type: 'notification'
          },
          {
            id: 'sample_3',
            title: 'New Course Materials Added',
            message: 'Fresh learning materials have been added to your enrolled courses.',
            priority: 'normal',
            course_title: 'All Courses',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            created_by_name: 'Faculty',
            type: 'notification'
          }
        ]);
      }
      
      generateRecentActivity();
      generateUpcomingEvents();
    };

    fetchData();
  }, [user]); // Only re-run when user changes
  
  const generateRecentActivity = () => {
    const activities = [
      {
        id: 1,
        type: 'login',
        title: 'Logged in to dashboard',
        time: 'Just now',
        icon: FaUserGraduate,
        color: '#4CAF50'
      },
      {
        id: 2,
        type: 'attendance',
        title: 'Attendance marked for today',
        time: '2 hours ago',
        icon: FaCheckCircle,
        color: '#2196F3'
      },
      {
        id: 3,
        type: 'assignment',
        title: 'Assignment submitted',
        time: '1 day ago',
        icon: FaClipboardList,
        color: '#FF9800'
      }
    ];
    setRecentActivity(activities);
  };
  
  const generateUpcomingEvents = () => {
    const events = [
      {
        id: 1,
        title: 'Project Submission Deadline',
        date: '2024-02-15',
        type: 'deadline',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Monthly Assessment',
        date: '2024-02-20',
        type: 'exam',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Workshop on React Advanced',
        date: '2024-02-25',
        type: 'workshop',
        priority: 'low'
      }
    ];
    setUpcomingEvents(events);
  };
  
  const handleCourseSearch = (e) => {
    setCourseSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (courseSearchQuery.trim()) {
      console.log('Searching for courses:', courseSearchQuery);
    }
  };
  
  return (
    <DashboardErrorBoundary>
      <div className="ultra-modern-dashboard elegant-theme">
        <div className="dashboard-bg-animation">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
            <div className="shape shape-6"></div>
          </div>
          <div className="gradient-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>

        <div className="premium-header">
          <div className="header-content">
            <div className="welcome-section">
              <div className="welcome-left">
                <div className="greeting-badge elegant">
                  <FaAtom className="badge-icon" />
                  <span>Student Portal</span>
                  <div className="badge-glow"></div>
                  <div className="badge-particles">
                    <span className="particle"></span>
                    <span className="particle"></span>
                    <span className="particle"></span>
                  </div>
                </div>
                <h1 className="ultra-hero-title elegant">
                  <span className="title-greeting">Welcome back,</span>
                  <span className="name-highlight elegant">{user?.first_name || user?.username || 'Student'}</span>
                  <span className="title-exclamation elegant">✨</span>
                  <div className="dynamic-underline elegant"></div>
                </h1>
                <p className="ultra-hero-subtitle elegant">
                  <span className="subtitle-icon elegant">🎯</span>
                  Your personalized learning experience awaits 
                  <span className="subtitle-highlight elegant">Excellence is within reach</span>
                  <span className="subtitle-sparkle elegant">💫</span>
                </p>
              </div>
              
              <div className="welcome-right">
                <div className="ultra-avatar-container">
                  <div className="dual-orbit-system">
                    <div className="orbit-half orbit-top"></div>
                    <div className="orbit-half orbit-bottom"></div>
                    <div className="orbit-dots">
                      <div className="orbit-dot dot-1"></div>
                      <div className="orbit-dot dot-2"></div>
                      <div className="orbit-dot dot-3"></div>
                      <div className="orbit-dot dot-4"></div>
                    </div>
                  </div>
                  <div className="central-avatar">
                    <div className="avatar-ring"></div>
                    <span className="avatar-letter">
                      {(user?.first_name || user?.username || 'S').charAt(0).toUpperCase()}
                    </span>
                    <div className="avatar-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hero-metrics elegant">
              <div className="ultra-metric-card courses-card elegant">
                <div className="metric-glow elegant"></div>
                <div className="metric-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
                <div className="metric-header">
                  <div className="metric-icon-ultra">
                    <FaBook className="metric-icon" />
                    <div className="icon-ripple"></div>
                  </div>
                  <div className="metric-info">
                    <span className="metric-number">{enrollments?.length || dashboardStats.totalCourses || 0}</span>
                    <span className="metric-label">Enrolled Courses</span>
                  </div>
                </div>
                <div className="metric-progress-bar">
                  <div className="progress-fill" style={{width: '85%'}}></div>
                  <span className="progress-text">85% Active</span>
                </div>
                <div className="metric-footer">
                  <span className="trend-badge positive">
                    <FaArrowRight className="trend-arrow" />
                    Continue Learning
                  </span>
                </div>
              </div>
              
              <div className="ultra-metric-card achievements-card elegant">
                <div className="metric-glow elegant"></div>
                <div className="metric-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
                <div className="metric-header">
                  <div className="metric-icon-ultra">
                    <FaMedal className="metric-icon" />
                    <div className="icon-ripple"></div>
                  </div>
                  <div className="metric-info">
                    <span className="metric-number">{dashboardStats.achievements}</span>
                    <span className="metric-label">Achievements</span>
                  </div>
                </div>
                <div className="metric-progress-bar">
                  <div className="progress-fill" style={{width: '70%'}}></div>
                  <span className="progress-text">7/10 Earned</span>
                </div>
                <div className="metric-footer">
                  <span className="trend-badge positive">
                    <FaTrophy className="trend-star" />
                    Great Progress!
                  </span>
                </div>
              </div>
              
              <div className="ultra-metric-card attendance-card elegant">
                <div className="metric-glow elegant"></div>
                <div className="metric-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
                <div className="metric-header">
                  <div className="metric-icon-ultra">
                    <FaTarget className="metric-icon" />
                    <div className="icon-ripple"></div>
                  </div>
                  <div className="metric-info">
                    <span className="metric-number">{dashboardStats.attendancePercentage}%</span>
                    <span className="metric-label">Attendance Rate</span>
                  </div>
                </div>
                <div className="circular-progress">
                  <svg className="progress-ring" width="80" height="80">
                    <circle className="progress-ring-bg" cx="40" cy="40" r="30" />
                    <circle 
                      className="progress-ring-fill" 
                      cx="40" 
                      cy="40" 
                      r="30"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 30}`,
                        strokeDashoffset: `${2 * Math.PI * 30 * (1 - dashboardStats.attendancePercentage / 100)}`
                      }}
                    />
                  </svg>
                  <div className="progress-center">
                    <span className="progress-percent">{dashboardStats.attendancePercentage}%</span>
                  </div>
                </div>
                <div className="metric-footer">
                  <span className={`trend-badge ${dashboardStats.attendancePercentage >= 75 ? 'positive' : 'warning'}`}>
                    <FaCheckCircle className="trend-check" />
                    {dashboardStats.attendancePercentage >= 75 ? 'Excellent!' : 'Keep Going!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modern-dashboard-grid">
          {/* Action Buttons Row */}
          <div className="actions-row">
            <div className="modern-actions-horizontal">
              <Link to="/student/attendance" className="action-btn-horizontal attendance">
                <FaCalendarCheck className="action-icon" />
                <span>Attendance</span>
              </Link>
              
              <Link to="/student/fee-management" className="action-btn-horizontal fees">
                <FaMoneyBillWave className="action-icon" />
                <span>Payments</span>
              </Link>
              
              <Link to="/student/projects" className="action-btn-horizontal projects">
                <FaProjectDiagram className="action-icon" />
                <span>Projects</span>
              </Link>
              
              <Link to="/student/assignments" className="action-btn-horizontal assignments">
                <FaTasks className="action-icon" />
                <span>Assignments</span>
              </Link>
              
              <Link to="/student/achievements" className="action-btn-horizontal achievements">
                <FaTrophy className="action-icon" />
                <span>Achievements</span>
              </Link>
            </div>
          </div>

          {/* Learning Journey and Notifications Row */}
          <div className="learning-notifications-row">
            <div className="learning-journey-section">
              <div className="modern-section learning-progress elegant">
                <div className="section-header-modern elegant">
                  <div className="header-content-modern">
                    <div className="section-badge elegant">
                      <FaLayerGroup className="badge-icon" />
                      <span>Learning Journey</span>
                    </div>
                    <h2 className="elegant-title">My Courses ({enrollments?.length || 0})</h2>
                    <p className="elegant-subtitle">Continue your learning progress</p>
                  </div>
                  <Link to="/explore" className="modern-btn primary elegant">
                    <FaCompass />
                    <span>Explore More</span>
                  </Link>
                </div>
                  

  

                <div className="enrolled-courses-grid">
                  {enrollments && enrollments.length > 0 ? (
                    enrollments.map((enrollment, index) => {
                      const courseId = enrollment.course;
                      const progress = courseProgress[courseId] || {
                        courseName: enrollment.course_title || 'Course',
                        instructor: 'Instructor',
                        progress: 0,
                        completedVideos: 0,
                        totalVideos: 0,
                        nextVideo: 'Start Learning',
                        lastWatched: 'Never'
                      };
                      
                      return (
                        <div key={courseId} className="course-card-dashboard">
                          <div className="course-card-header">
                            <div className="course-thumbnail">
                              {progress.courseImage ? (
                                <img src={progress.courseImage} alt={progress.courseName} />
                              ) : (
                                <div className="course-placeholder">
                                  <FaBook />
                                </div>
                              )}
                            </div>
                            <div className="course-progress-circle">
                              <svg viewBox="0 0 36 36" className="circular-chart">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle" strokeDasharray={`${progress.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              </svg>
                              <div className="percentage">{progress.progress}%</div>
                            </div>
                          </div>
                          
                          <div className="course-card-body">
                            <h3 className="course-name">{progress.courseName}</h3>
                            <div className="course-instructor">
                              <FaUser className="instructor-icon" />
                              <span>{progress.instructor}</span>
                            </div>
                            
                            <div className="progress-details">
                              <div className="progress-bar-full">
                                <div className="progress-fill" style={{width: `${progress.progress}%`}}></div>
                              </div>
                              <div className="progress-stats">
                                <span className="completed-videos">
                                  <FaCheckCircle className="check-icon" />
                                  {progress.completedVideos}/{progress.totalVideos} videos completed
                                </span>
                              </div>
                            </div>
                            
                            <div className="next-lesson">
                              <FaPlay className="play-icon" />
                              <div className="lesson-info">
                                <span className="lesson-label">Next Lesson:</span>
                                <span className="lesson-title">{progress.nextVideo}</span>
                              </div>
                            </div>
                            
                            <div className="last-activity">
                              <FaClock className="clock-icon" />
                              <span>Last watched: {progress.lastWatched}</span>
                            </div>
                          </div>
                          
                          <div className="course-card-footer">
                            <Link to={`/student/courses/${courseId}`} className="continue-learning-btn">
                              <FaPlay />
                              <span>Continue Learning</span>
                              <FaChevronRight className="arrow-icon" />
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-courses-dashboard">
                      <div className="empty-state-icon">
                        <FaGraduationCap />
                      </div>
                      <h3>Start Your Learning Journey</h3>
                      <p>Enroll in courses to see your progress here</p>
                      <Link to="/explore" className="explore-courses-btn">
                        <FaRocket />
                        <span>Explore Courses</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="notifications-section">
              <div className="modern-section notifications elegant">
                <div className="section-header-modern elegant">
                  <div className="header-content-modern">
                    <div className="section-badge elegant">
                      <FaBell className="badge-icon" />
                      <span>Notifications</span>
                    </div>
                    <h2 className="elegant-title">Latest Updates</h2>
                  </div>
                </div>
                
                <div className="notifications-list">
                  {announcements.length > 0 ? (
                    announcements.slice(0, 3).map((announcement, index) => (
                      <div key={announcement.id} className={`notification-item announcement-${announcement.priority}`}>
                        <div className="notification-icon-wrapper">
                          <FaBell className="notification-icon" />
                          {announcement.priority === 'urgent' && <div className="urgent-pulse"></div>}
                        </div>
                        <div className="notification-content">
                          <h4>{announcement.title}</h4>
                          <p>{announcement.message.length > 60 ? announcement.message.substring(0, 60) + '...' : announcement.message}</p>
                          <div className="notification-meta">
                            <span className="course-name">{announcement.course_title || 'All Courses'}</span>
                            <span className="notification-time">{new Date(announcement.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`priority-badge ${announcement.priority}`}>
                          {announcement.priority === 'urgent' && '🚨'}
                          {announcement.priority === 'important' && '⚠️'}
                          {announcement.priority === 'normal' && '📢'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <FaHeart className="empty-icon" />
                      <p>All caught up! 🎉</p>
                    </div>
                  )}
                  
                  {announcements.length > 3 && (
                    <div className="view-all-notifications">
                      <Link to="/student/notifications" className="view-all-btn">
                        <span>View All Announcements ({announcements.length})</span>
                        <FaChevronRight />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Activity and Events Row */}
          <div className="activity-events-row">
            <div className="modern-section activity-section elegant">
              <div className="section-header-modern elegant">
                <div className="header-content-modern">
                  <div className="section-badge elegant">
                    <FaChartLine className="badge-icon" />
                    <span>Recent Activity</span>
                  </div>
                  <h2 className="elegant-title">Activity Timeline</h2>
                </div>
              </div>
              
              <div className="activity-list">
                {recentActivity.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon" style={{backgroundColor: activity.color}}>
                        <IconComponent />
                      </div>
                      <div className="activity-content">
                        <h4>{activity.title}</h4>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="modern-section events-section elegant">
              <div className="section-header-modern elegant">
                <div className="header-content-modern">
                  <div className="section-badge elegant">
                    <FaCalendar className="badge-icon" />
                    <span>Upcoming Events</span>
                  </div>
                  <h2 className="elegant-title">Schedule</h2>
                </div>
              </div>
              
              <div className="events-list">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-date">
                      <span className="date-day">{new Date(event.date).getDate()}</span>
                      <span className="date-month">{new Date(event.date).toLocaleDateString('en', {month: 'short'})}</span>
                    </div>
                    <div className="event-info">
                      <h4>{event.title}</h4>
                      <span className="event-type">{event.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <ChatWidget />
        <NotificationContainer />
      </div>
    </DashboardErrorBoundary>
  )
}