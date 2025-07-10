import React, { useState, useEffect } from 'react';
import './StudentAttendance.css';
import { userAxiosInstance } from '../../api';
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartPie, 
  FaFilter,
  FaCalendarCheck,
  FaTrophy,
  FaFire,
  FaGift,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDownload,
  FaStar,
  FaGem,
  FaCrown,
  FaRocket,
  FaLightbulb,
  FaAtom,
  FaMagic,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const StudentAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showReport, setShowReport] = useState(false);
  
  useEffect(() => {
    fetchAttendanceData();
  }, []);
  
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await userAxiosInstance.get('attendance/my_attendance/');
      console.log('Attendance data:', response.data);
      
      if (!response.data || !response.data.statistics) {
        console.error('Invalid attendance data structure:', response.data);
        return;
      }
      
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusClass = (percentage) => {
    if (percentage >= 85) return 'status-excellent';
    if (percentage >= 75) return 'status-good';
    if (percentage >= 60) return 'status-average';
    return 'status-poor';
  };
  
  const getStatusText = (percentage) => {
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Poor';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const filterAttendanceByMonth = (attendance) => {
    if (selectedMonth === 'all') return attendance;
    
    return attendance.filter(record => {
      const recordDate = new Date(record.date);
      const monthYear = recordDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return monthYear === selectedMonth;
    });
  };
  
  const getAvailableMonths = () => {
    if (!attendanceData || !attendanceData.attendance) return [];
    
    const months = new Set();
    attendanceData.attendance.forEach(record => {
      const recordDate = new Date(record.date);
      const monthYear = recordDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      months.add(monthYear);
    });
    
    return Array.from(months);
  };

  const getAttendanceForDate = (date) => {
    if (!attendanceData || !attendanceData.attendance) return null;
    
    // Create date string in local timezone to match backend format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const record = attendanceData.attendance.find(record => record.date === dateStr);
    return record;
  };

  const isHoliday = (date) => {
    if (!attendanceData || !attendanceData.holidays) return false;
    
    // Create date string in local timezone to match backend format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return attendanceData.holidays.some(holiday => holiday.date === dateStr);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = current.getMonth() === month;
      const attendance = getAttendanceForDate(current);
      const holiday = isHoliday(current);
      
      let className = 'calendar-day';
      
      if (!isCurrentMonth) {
        className += ' other-month';
      } else {
        // Only apply status classes for current month days
        if (holiday) {
          className += ' holiday';
        } else if (attendance) {
          // Check if student was present or absent
          if (attendance.is_present === true) {
            className += ' present';
          } else if (attendance.is_present === false) {
            className += ' absent';
          }
        }
        // If no attendance record and not holiday, day remains neutral (white)
      }
      
      const dateKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}-${i}`;
      
      days.push(
        <div key={dateKey} className={className}>
          {current.getDate()}
        </div>
      );
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="ultra-modern-attendance-container">
        <div className="modern-loading-state">
          <div className="loading-animation">
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
            <div className="loading-circle"></div>
          </div>
          <h3>Loading Your Attendance</h3>
          <p>Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }
  
  if (!attendanceData) {
    return (
      <div className="ultra-modern-attendance-container">
        <div className="modern-error-state">
          <div className="error-animation">
            <FaTimesCircle className="error-icon" />
          </div>
          <h3>Oops! Something went wrong</h3>
          <p>We couldn't load your attendance data. Please try again.</p>
          <button onClick={fetchAttendanceData} className="modern-retry-btn">
            <FaArrowUp className="btn-icon" />
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const attendance = attendanceData?.attendance || [];
  const filteredAttendance = filterAttendanceByMonth(attendance);
  const availableMonths = getAvailableMonths();
  const statistics = attendanceData?.statistics || {
    total_working_days: 0,
    present_days: 0,
    absent_days: 0,
    attendance_percentage: 0
  };
  
  return (
    <div className="ultra-modern-attendance-container">
      {/* Hero Header */}
      <div className="premium-hero-section">
        <div className="hero-content-premium">
          <div className="premium-badge">
            <FaAtom className="badge-icon-premium" />
            <span>Attendance Dashboard</span>
          </div>
          
          <h1 className="premium-hero-title">
            <span className="title-line-1">Your Academic</span>
            <span className="title-line-2">
              <span className="title-highlight-premium">Attendance</span>
              <span className="title-accent">Overview</span>
            </span>
          </h1>
          
          <p className="premium-hero-subtitle">
            Track your attendance progress and maintain consistency in your academic journey
          </p>
        </div>

        {/* Control Panel */}
        <div className="premium-control-panel">
          <div className="control-glass-container">
            <div className="filter-section-premium">
              <div className="filter-label">
                <FaFilter className="filter-label-icon" />
                <span>Filter Period</span>
              </div>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="premium-select"
              >
                <option value="all">All Months</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div className="action-buttons-premium">
              <button 
                className="premium-btn primary-btn"
                onClick={() => setShowReport(!showReport)}
              >
                <FaEye className="btn-icon-premium" />
                <span>{showReport ? 'Hide Report' : 'View Report'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ultra-premium-stats-grid">
        <div className="premium-stat-card total-days-card">
          <div className="card-header-premium">
            <div className="icon-container-premium">
              <FaCalendarAlt className="card-icon-premium" />
            </div>
          </div>
          
          <div className="card-content-premium">
            <div className="metric-display">
              <span className="metric-number-premium">{statistics.total_working_days || 0}</span>
              <span className="metric-unit-premium">Days</span>
            </div>
            <h3 className="metric-title-premium">Total Working Days</h3>
            <p className="metric-description-premium">Academic period coverage</p>
          </div>
        </div>
        
        <div className="premium-stat-card present-days-card">
          <div className="card-header-premium">
            <div className="icon-container-premium">
              <FaCheckCircle className="card-icon-premium" />
            </div>
          </div>
          
          <div className="card-content-premium">
            <div className="metric-display">
              <span className="metric-number-premium">{statistics.present_days || 0}</span>
              <span className="metric-unit-premium">Days</span>
            </div>
            <h3 className="metric-title-premium">Present Days</h3>
            <p className="metric-description-premium">Outstanding consistency!</p>
          </div>
        </div>
        
        <div className="premium-stat-card absent-days-card">
          <div className="card-header-premium">
            <div className="icon-container-premium">
              <FaTimesCircle className="card-icon-premium" />
            </div>
          </div>
          
          <div className="card-content-premium">
            <div className="metric-display">
              <span className="metric-number-premium">{statistics.absent_days || 0}</span>
              <span className="metric-unit-premium">Days</span>
            </div>
            <h3 className="metric-title-premium">Absent Days</h3>
            <p className="metric-description-premium">{statistics.absent_days === 0 ? 'Perfect record!' : 'Room for improvement'}</p>
          </div>
        </div>
        
        <div className="premium-stat-card percentage-card">
          <div className="card-header-premium">
            <div className="icon-container-premium">
              <FaChartPie className="card-icon-premium" />
            </div>
          </div>
          
          <div className="card-content-premium">
            <div className="metric-display">
              <span className="metric-number-premium">{statistics.attendance_percentage || 0}</span>
              <span className="metric-unit-premium">%</span>
            </div>
            <h3 className="metric-title-premium">Attendance Rate</h3>
            <p className="metric-description-premium">Overall performance - {getStatusText(statistics.attendance_percentage || 0)}</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      {showReport ? (
        /* Report View - Full Width */
        <div className="report-view-container">
          <div className="report-section">
            <div className="section-header-modern">
              <div className="section-icon">
                <FaChartPie />
              </div>
              <div className="header-text">
                <h2>Attendance Report</h2>
                <p>Detailed attendance records for {selectedMonth === 'all' ? 'all months' : selectedMonth}</p>
              </div>
            </div>
            
            <div className="report-table-container">
              {filteredAttendance.length > 0 ? (
                <div className="modern-table-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="th-content">
                            <FaCalendarAlt className="th-icon" />
                            Date
                          </div>
                        </th>
                        <th>
                          <div className="th-content">
                            Day
                          </div>
                        </th>
                        <th>
                          <div className="th-content">
                            Status
                          </div>
                        </th>
                        <th>
                          <div className="th-content">
                            Remarks
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map(record => (
                        <tr key={record.id} className="report-row">
                          <td>
                            <div className="date-cell">
                              <span className="date-primary">{formatDate(record.date)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="day-cell">
                              <span className="day-name">{record.day_of_week}</span>
                            </div>
                          </td>
                          <td>
                            <div className="status-cell">
                              <div className={`status-badge ${record.is_present ? 'present' : 'absent'}`}>
                                {record.is_present ? (
                                  <>
                                    <FaCheckCircle className="status-icon" />
                                    <span>Present</span>
                                  </>
                                ) : (
                                  <>
                                    <FaTimesCircle className="status-icon" />
                                    <span>Absent</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="remarks-cell">
                              <span className="remarks-text">{record.remarks || 'No remarks'}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-report">
                  <div className="empty-icon">
                    <FaChartPie />
                  </div>
                  <h3>No Records Found</h3>
                  <p>No attendance records available for the selected period.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Default View - Holidays and Calendar Side by Side */
        <div className="default-content-layout">
          {/* Holidays Section */}
          <div className="holidays-section">
            <div className="section-header-modern">
              <div className="section-icon">
                <FaGift />
              </div>
              <div className="header-text">
                <h2>Holidays</h2>
                <p>Upcoming & recent holidays</p>
              </div>
            </div>
            
            {attendanceData.holidays && attendanceData.holidays.length > 0 ? (
              <div className="modern-holidays-list">
                {attendanceData.holidays.map((holiday, index) => (
                  <div key={index} className="modern-holiday-card">
                    <div className="holiday-icon">
                      <FaGift />
                    </div>
                    <div className="holiday-content">
                      <div className="holiday-name">{holiday.name}</div>
                      <div className="holiday-date">{formatDate(holiday.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="modern-empty-state">
                <p>No holidays scheduled</p>
              </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className="calendar-section enhanced">
            <div className="section-header-modern">
              <div className="section-icon">
                <FaCalendarCheck />
              </div>
              <div className="header-text">
                <h2>Calendar View</h2>
                <p>Visual attendance overview</p>
              </div>
            </div>
            
            <div className="calendar-container">
              <div className="calendar-header">
                <button 
                  className="calendar-nav-btn prev" 
                  onClick={() => navigateMonth(-1)}
                  title="Previous Month"
                >
                  <FaChevronLeft />
                </button>
                <div className="calendar-month-year" onClick={goToToday} title="Go to Today">
                  {formatMonthYear(currentDate)}
                </div>
                <button 
                  className="calendar-nav-btn next" 
                  onClick={() => navigateMonth(1)}
                  title="Next Month"
                >
                  <FaChevronRight />
                </button>
              </div>
              
              <div className="enhanced-calendar-grid">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>
                {renderCalendar()}
              </div>
              
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color present"></div>
                  <span>Present</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color absent"></div>
                  <span>Absent</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color holiday"></div>
                  <span>Holiday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;