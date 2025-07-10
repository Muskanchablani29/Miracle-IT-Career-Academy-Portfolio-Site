import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../api';
import { FaUser, FaBook, FaChartLine, FaCheck, FaClock } from 'react-icons/fa';

// Fake progress data for demonstration
const FAKE_PROGRESS_DATA = [
  {
    student_id: 1,
    student_name: 'John Doe',
    course_id: 1,
    course_title: 'Full Stack Web Development',
    completion_percentage: 35.0,
    videos_completed: 7,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-19T10:30:00Z'
  },
  {
    student_id: 2,
    student_name: 'Jane Smith',
    course_id: 1,
    course_title: 'Full Stack Web Development',
    completion_percentage: 30.0,
    videos_completed: 6,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-18T14:20:00Z'
  },
  {
    student_id: 3,
    student_name: 'Mike Johnson',
    course_id: 2,
    course_title: 'Python Programming',
    completion_percentage: 40.0,
    videos_completed: 8,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-19T09:15:00Z'
  },
  {
    student_id: 4,
    student_name: 'Sarah Wilson',
    course_id: 2,
    course_title: 'Python Programming',
    completion_percentage: 40.0,
    videos_completed: 8,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-17T16:45:00Z'
  },
  {
    student_id: 5,
    student_name: 'David Brown',
    course_id: 3,
    course_title: 'Data Science & Analytics',
    completion_percentage: 25.0,
    videos_completed: 5,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-19T11:00:00Z'
  },
  {
    student_id: 6,
    student_name: 'Emily Davis',
    course_id: 1,
    course_title: 'Full Stack Web Development',
    completion_percentage: 30.0,
    videos_completed: 6,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-18T13:30:00Z'
  },
  {
    student_id: 7,
    student_name: 'Alex Miller',
    course_id: 3,
    course_title: 'Data Science & Analytics',
    completion_percentage: 35.0,
    videos_completed: 7,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-19T08:45:00Z'
  },
  {
    student_id: 8,
    student_name: 'Lisa Garcia',
    course_id: 2,
    course_title: 'Python Programming',
    completion_percentage: 40.0,
    videos_completed: 8,
    total_videos: 20,
    status: 'In Progress',
    last_activity: '2024-12-18T15:20:00Z'
  }
];

const FAKE_ANALYTICS = {
  total_students: 8,
  completed_students: 0,
  in_progress_students: 8,
  not_started_students: 0,
  average_completion: 34.4
};

const StudentProgressDashboard = () => {
  const [progressData, setProgressData] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchProgressData();
    fetchAnalytics();
  }, [selectedCourse]);

  const fetchProgressData = async () => {
    try {
      // Use fake data for now
      setProgressData(FAKE_PROGRESS_DATA);
      // Uncomment below when API is ready
      // const response = await userAxiosInstance.get('course-progress/admin_dashboard/');
      // setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setProgressData(FAKE_PROGRESS_DATA);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Use fake analytics for now
      setAnalytics(FAKE_ANALYTICS);
      setLoading(false);
      // Uncomment below when API is ready
      // const params = selectedCourse ? `?course_id=${selectedCourse}` : '';
      // const response = await userAxiosInstance.get(`course-progress/course_analytics/${params}`);
      // setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(FAKE_ANALYTICS);
      setLoading(false);
    }
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    if (percentage > 0) return '#3b82f6';
    return '#6b7280';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 100) return <FaCheck />;
    if (percentage > 0) return <FaClock />;
    return <FaUser />;
  };

  if (loading) {
    return <div className="loading-spinner">Loading progress data...</div>;
  }

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <h2>Student Progress Dashboard</h2>
        <div className="analytics-cards">
          <div className="analytics-card">
            <div className="card-icon completed">
              <FaCheck />
            </div>
            <div className="card-content">
              <h3>{analytics.completed_students || 0}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="card-icon in-progress">
              <FaClock />
            </div>
            <div className="card-content">
              <h3>{analytics.in_progress_students || 0}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="card-icon total">
              <FaUser />
            </div>
            <div className="card-content">
              <h3>{analytics.total_students || 0}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="analytics-card">
            <div className="card-icon average">
              <FaChartLine />
            </div>
            <div className="card-content">
              <h3>{Math.round(analytics.average_completion || 0)}%</h3>
              <p>Avg Completion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Progress</th>
              <th>Videos</th>
              <th>Status</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {progressData.map((progress, index) => (
              <tr key={index}>
                <td>
                  <div className="student-info">
                    <FaUser className="student-icon" />
                    {progress.student_name}
                  </div>
                </td>
                <td>
                  <div className="course-info">
                    <FaBook className="course-icon" />
                    {progress.course_title}
                  </div>
                </td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{
                          width: `${progress.completion_percentage}%`,
                          backgroundColor: getStatusColor(progress.completion_percentage)
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">{progress.completion_percentage}%</span>
                  </div>
                </td>
                <td>
                  <span className="video-count">
                    {progress.videos_completed}/{progress.total_videos}
                  </span>
                </td>
                <td>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(progress.completion_percentage) }}
                  >
                    {getStatusIcon(progress.completion_percentage)}
                    {progress.status}
                  </div>
                </td>
                <td>
                  <span className="last-activity">
                    {new Date(progress.last_activity).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProgressDashboard;