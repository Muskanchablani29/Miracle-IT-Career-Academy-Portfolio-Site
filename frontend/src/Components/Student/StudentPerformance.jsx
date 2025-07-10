import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaAward, FaTrophy, FaGraduationCap, FaCalendarAlt,
  FaProjectDiagram, FaCode, FaBookOpen, FaClock, FaBullseye,
  FaArrowUp, FaArrowDown, FaEye, FaDownload, FaFilter,
  FaStar, FaFire, FaRocket, FaGem, FaMedal, FaCrown
} from 'react-icons/fa';
import { userAxiosInstance, getStudentPerformanceAnalytics } from '../../api';
import './StudentPerformance.css';

const StudentPerformance = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, analytics
  
  // Chart refs
  const gradeChartRef = useRef(null);
  const progressChartRef = useRef(null);
  const attendanceChartRef = useRef(null);
  const performanceTrendRef = useRef(null);
  const skillsRadarRef = useRef(null);
  const projectsTimelineRef = useRef(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [selectedPeriod]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple data sources
      const [dashboardData, attendanceData, projectsData, achievementsData, analyticsData] = await Promise.all([
        userAxiosInstance.get('student-dashboard/'),
        userAxiosInstance.get('attendance/my_attendance/'),
        userAxiosInstance.get('project-submissions/'),
        userAxiosInstance.get('student-achievements/'),
        getStudentPerformanceAnalytics()
      ]);

      // Combine and process data
      const combinedData = {
        dashboard: dashboardData.data,
        attendance: attendanceData.data,
        projects: projectsData.data,
        achievements: achievementsData.data,
        analytics: analyticsData,
        // Generate performance metrics from real data
        performance: {
          overallGPA: calculateGPA(analyticsData.overview.average_grade),
          attendanceScore: analyticsData.overview.attendance_percentage,
          projectCompletionRate: analyticsData.overview.completion_rate,
          skillsProgress: analyticsData.skills_assessment,
          monthlyProgress: analyticsData.monthly_trends,
          gradeDistribution: analyticsData.grade_distribution,
          performanceRank: analyticsData.performance_rank
        }
      };

      setPerformanceData(combinedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError('Failed to load performance data');
      // Set mock data for demonstration
      setPerformanceData(getMockPerformanceData());
    } finally {
      setLoading(false);
    }
  };

  const generatePerformanceMetrics = (dashboard, attendance, projects) => {
    const attendancePercentage = attendance?.statistics?.attendance_percentage || 0;
    const completedProjects = projects?.filter(p => p.status === 'approved')?.length || 0;
    const totalProjects = projects?.length || 0;
    const averageGrade = projects?.reduce((sum, p) => sum + (p.grade || 0), 0) / (projects?.length || 1);
    
    return {
      overallGPA: calculateGPA(averageGrade),
      attendanceScore: attendancePercentage,
      projectCompletionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
      skillsProgress: generateSkillsProgress(projects),
      monthlyProgress: generateMonthlyProgress(attendance, projects),
      gradeDistribution: generateGradeDistribution(projects),
      performanceRank: calculatePerformanceRank(attendancePercentage, completedProjects, averageGrade)
    };
  };

  const calculateGPA = (averageGrade) => {
    if (averageGrade >= 90) return 4.0;
    if (averageGrade >= 80) return 3.5;
    if (averageGrade >= 70) return 3.0;
    if (averageGrade >= 60) return 2.5;
    return 2.0;
  };

  const generateSkillsProgress = (projects) => {
    const skills = {
      'Frontend Development': Math.random() * 40 + 60,
      'Backend Development': Math.random() * 30 + 50,
      'Database Management': Math.random() * 25 + 45,
      'Problem Solving': Math.random() * 35 + 55,
      'Code Quality': Math.random() * 30 + 60,
      'Project Management': Math.random() * 20 + 40
    };
    return skills;
  };

  const generateMonthlyProgress = (attendance, projects) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      attendance: Math.random() * 20 + 75,
      projects: Math.random() * 3 + 2,
      performance: Math.random() * 15 + 80
    }));
  };

  const generateGradeDistribution = (projects) => {
    return {
      'A (90-100)': Math.floor(Math.random() * 5) + 2,
      'B (80-89)': Math.floor(Math.random() * 4) + 3,
      'C (70-79)': Math.floor(Math.random() * 3) + 1,
      'D (60-69)': Math.floor(Math.random() * 2),
      'F (<60)': Math.floor(Math.random() * 1)
    };
  };

  const calculatePerformanceRank = (attendance, projects, grade) => {
    const score = (attendance * 0.3) + (projects * 10 * 0.4) + (grade * 0.3);
    if (score >= 85) return { rank: 'Excellent', percentile: 95, color: '#10B981' };
    if (score >= 75) return { rank: 'Good', percentile: 80, color: '#3B82F6' };
    if (score >= 65) return { rank: 'Average', percentile: 60, color: '#F59E0B' };
    return { rank: 'Needs Improvement', percentile: 40, color: '#EF4444' };
  };

  const getMockPerformanceData = () => ({
    dashboard: {
      student_info: { username: 'Student', enrollment_id: 'STU001' },
      stats: { total_courses: 3, completed_assignments: 8, attendance_percentage: 87.5, achievements_count: 5 }
    },
    attendance: { statistics: { attendance_percentage: 87.5, present_days: 35, total_working_days: 40 } },
    projects: [
      { id: 1, project: { title: 'E-commerce Website' }, status: 'approved', grade: 92 },
      { id: 2, project: { title: 'Data Analysis Tool' }, status: 'approved', grade: 88 },
      { id: 3, project: { title: 'Mobile App' }, status: 'submitted', grade: null }
    ],
    achievements: [
      { name: 'First Project Completed', icon: 'star' },
      { name: 'Perfect Attendance', icon: 'trophy' }
    ],
    performance: {
      overallGPA: 3.7,
      attendanceScore: 87.5,
      projectCompletionRate: 85,
      skillsProgress: {
        'Frontend Development': 85,
        'Backend Development': 75,
        'Database Management': 70,
        'Problem Solving': 80,
        'Code Quality': 78,
        'Project Management': 65
      },
      monthlyProgress: [
        { month: 'Jan', attendance: 90, projects: 2, performance: 88 },
        { month: 'Feb', attendance: 85, projects: 3, performance: 86 },
        { month: 'Mar', attendance: 88, projects: 2, performance: 89 },
        { month: 'Apr', attendance: 87, projects: 1, performance: 85 },
        { month: 'May', attendance: 89, projects: 2, performance: 90 },
        { month: 'Jun', attendance: 86, projects: 3, performance: 87 }
      ],
      gradeDistribution: { 'A (90-100)': 4, 'B (80-89)': 6, 'C (70-79)': 2, 'D (60-69)': 1, 'F (<60)': 0 },
      performanceRank: { rank: 'Good', percentile: 82, color: '#3B82F6' }
    }
  });

  // Initialize charts after data is loaded
  useEffect(() => {
    if (performanceData && !loading) {
      initializeCharts();
    }
  }, [performanceData, loading, viewMode]);

  const initializeCharts = () => {
    // Grade Distribution Chart
    if (gradeChartRef.current) {
      const gradeChart = echarts.init(gradeChartRef.current);
      const gradeData = performanceData.performance.gradeDistribution;
      gradeChart.setOption({
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', left: 'left', textStyle: { color: '#64748b' } },
        series: [{
          name: 'Grades',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: Object.entries(gradeData).map(([name, value]) => ({ value, name }))
        }]
      });
    }

    // Skills Radar Chart
    if (skillsRadarRef.current) {
      const skillsChart = echarts.init(skillsRadarRef.current);
      const skillsData = performanceData.performance.skillsProgress;
      skillsChart.setOption({
        tooltip: { trigger: 'item' },
        radar: {
          indicator: Object.keys(skillsData).map(skill => ({ name: skill, max: 100 })),
          shape: 'circle',
          splitNumber: 5,
          axisName: { color: '#64748b' },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
          splitArea: { show: false }
        },
        series: [{
          name: 'Skills Progress',
          type: 'radar',
          data: [{
            value: Object.values(skillsData),
            name: 'Current Level',
            itemStyle: { color: '#3B82F6' },
            areaStyle: { color: 'rgba(59, 130, 246, 0.3)' }
          }]
        }]
      });
    }

    // Performance Trend Chart
    if (performanceTrendRef.current) {
      const trendChart = echarts.init(performanceTrendRef.current);
      const monthlyData = performanceData.performance.monthlyProgress;
      trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['Attendance', 'Projects', 'Performance'], textStyle: { color: '#64748b' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: monthlyData.map(d => d.month), axisLine: { lineStyle: { color: '#e2e8f0' } } },
        yAxis: { type: 'value', axisLine: { lineStyle: { color: '#e2e8f0' } } },
        series: [
          {
            name: 'Attendance',
            type: 'line',
            smooth: true,
            data: monthlyData.map(d => d.attendance),
            itemStyle: { color: '#10B981' }
          },
          {
            name: 'Projects',
            type: 'bar',
            data: monthlyData.map(d => d.projects),
            itemStyle: { color: '#8B5CF6' }
          },
          {
            name: 'Performance',
            type: 'line',
            smooth: true,
            data: monthlyData.map(d => d.performance),
            itemStyle: { color: '#F59E0B' }
          }
        ]
      });
    }
  };

  if (loading) {
    return (
      <div className="performance-loading">
        <div className="loading-spinner"></div>
        <h3>Loading Performance Analytics...</h3>
        <p>Analyzing your academic journey</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-error">
        <FaChartLine className="error-icon" />
        <h3>Unable to Load Performance Data</h3>
        <p>{error}</p>
        <button onClick={fetchPerformanceData} className="retry-btn">
          <FaArrowUp /> Try Again
        </button>
      </div>
    );
  }

  const { dashboard, attendance, projects, achievements, performance } = performanceData;

  return (
    <div className="modern-performance-dashboard">
      {/* Header Section */}
      <motion.div 
        className="performance-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="title-section">
            <div className="performance-badge">
              <FaTrophy className="badge-icon" />
              <span>Performance Analytics</span>
            </div>
            <h1 className="performance-title">
              <span className="title-main">Academic Performance</span>
              <span className="title-sub">Dashboard</span>
            </h1>
            <p className="performance-subtitle">
              Comprehensive analysis of your learning journey and achievements
            </p>
          </div>
          
          <div className="header-controls">
            <div className="view-mode-selector">
              {['overview', 'detailed', 'analytics'].map(mode => (
                <button
                  key={mode}
                  className={`mode-btn ${viewMode === mode ? 'active' : ''}`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="period-selector">
              <FaFilter className="filter-icon" />
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="period-select"
              >
                <option value="all">All Time</option>
                <option value="current">Current Semester</option>
                <option value="last3">Last 3 Months</option>
                <option value="last6">Last 6 Months</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Overview Cards */}
      <motion.div 
        className="performance-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="overview-card gpa-card">
          <div className="card-header">
            <div className="card-icon">
              <FaGraduationCap />
            </div>
            <div className="card-trend positive">
              <FaArrowUp />
              <span>+0.2</span>
            </div>
          </div>
          <div className="card-content">
            <div className="metric-value">{performance.overallGPA.toFixed(1)}</div>
            <div className="metric-label">Overall GPA</div>
            <div className="metric-description">Academic Excellence</div>
          </div>
        </div>

        <div className="overview-card attendance-card">
          <div className="card-header">
            <div className="card-icon">
              <FaCalendarAlt />
            </div>
            <div className="card-trend positive">
              <FaArrowUp />
              <span>+2.5%</span>
            </div>
          </div>
          <div className="card-content">
            <div className="metric-value">{performance.attendanceScore.toFixed(1)}%</div>
            <div className="metric-label">Attendance Rate</div>
            <div className="metric-description">Consistency Score</div>
          </div>
        </div>

        <div className="overview-card projects-card">
          <div className="card-header">
            <div className="card-icon">
              <FaProjectDiagram />
            </div>
            <div className="card-trend positive">
              <FaArrowUp />
              <span>+15%</span>
            </div>
          </div>
          <div className="card-content">
            <div className="metric-value">{performance.projectCompletionRate.toFixed(0)}%</div>
            <div className="metric-label">Project Success</div>
            <div className="metric-description">Completion Rate</div>
          </div>
        </div>

        <div className="overview-card rank-card">
          <div className="card-header">
            <div className="card-icon">
              <FaMedal />
            </div>
            <div className="rank-percentile">
              Top {100 - performance.performanceRank.percentile}%
            </div>
          </div>
          <div className="card-content">
            <div className="metric-value" style={{ color: performance.performanceRank.color }}>
              {performance.performanceRank.rank}
            </div>
            <div className="metric-label">Performance Rank</div>
            <div className="metric-description">Class Standing</div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="charts-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="chart-card grade-distribution">
          <div className="chart-header">
            <h3><FaChartLine /> Grade Distribution</h3>
            <div className="chart-actions">
              <button className="chart-btn"><FaEye /></button>
              <button className="chart-btn"><FaDownload /></button>
            </div>
          </div>
          <div className="chart-container">
            <div ref={gradeChartRef} className="chart"></div>
          </div>
        </div>

        <div className="chart-card skills-radar">
          <div className="chart-header">
            <h3><FaBullseye /> Skills Assessment</h3>
            <div className="chart-actions">
              <button className="chart-btn"><FaEye /></button>
              <button className="chart-btn"><FaDownload /></button>
            </div>
          </div>
          <div className="chart-container">
            <div ref={skillsRadarRef} className="chart"></div>
          </div>
        </div>

        <div className="chart-card performance-trend full-width">
          <div className="chart-header">
            <h3><FaRocket /> Performance Trends</h3>
            <div className="chart-actions">
              <button className="chart-btn"><FaEye /></button>
              <button className="chart-btn"><FaDownload /></button>
            </div>
          </div>
          <div className="chart-container">
            <div ref={performanceTrendRef} className="chart"></div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Performance Table */}
      <motion.div 
        className="performance-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="details-header">
          <h3><FaBookOpen /> Detailed Performance Report</h3>
          <div className="details-actions">
            <button className="action-btn primary">
              <FaDownload /> Export Report
            </button>
          </div>
        </div>
        
        <div className="performance-table-container">
          <table className="performance-table">
            <thead>
              <tr>
                <th>Project/Assignment</th>
                <th>Type</th>
                <th>Status</th>
                <th>Grade</th>
                <th>Submission Date</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {(performanceData?.analytics?.recent_submissions || projects).map((project, index) => (
                <tr key={project.id || index}>
                  <td>
                    <div className="project-info">
                      <FaCode className="project-icon" />
                      <span>{project.project_title || project.project?.title || `Project ${index + 1}`}</span>
                    </div>
                  </td>
                  <td>
                    <span className="project-type">Project</span>
                  </td>
                  <td>
                    <span className={`status-badge ${project.status}`}>
                      {project.status === 'approved' ? 'Completed' : 
                       project.status === 'submitted' ? 'Under Review' : 'In Progress'}
                    </span>
                  </td>
                  <td>
                    <div className="grade-cell">
                      {project.grade ? (
                        <>
                          <span className="grade-value">{project.grade}%</span>
                          <span className={`grade-letter ${getGradeLetter(project.grade)}`}>
                            {getGradeLetter(project.grade)}
                          </span>
                        </>
                      ) : (
                        <span className="grade-pending">Pending</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FaClock className="date-icon" />
                      {project.submission_date ? 
                        new Date(project.submission_date).toLocaleDateString() : 
                        'Not submitted'
                      }
                    </div>
                  </td>
                  <td>
                    <div className="feedback-cell">
                      {project.feedback ? (
                        <span className="feedback-available">Available</span>
                      ) : (
                        <span className="feedback-pending">Pending</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div 
        className="achievements-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="achievements-header">
          <h3><FaAward /> Recent Achievements</h3>
          <div className="achievements-count">
            {achievements.length} Earned
          </div>
        </div>
        
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <div className="achievement-icon">
                {getAchievementIcon(achievement.icon)}
              </div>
              <div className="achievement-content">
                <h4>{achievement.name}</h4>
                <p>{achievement.description || 'Great accomplishment!'}</p>
              </div>
              <div className="achievement-badge">
                <FaGem />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Helper functions
const getGradeLetter = (grade) => {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};

const getAchievementIcon = (iconName) => {
  const icons = {
    star: <FaStar />,
    trophy: <FaTrophy />,
    medal: <FaMedal />,
    crown: <FaCrown />,
    fire: <FaFire />,
    rocket: <FaRocket />
  };
  return icons[iconName] || <FaAward />;
};

export default StudentPerformance;