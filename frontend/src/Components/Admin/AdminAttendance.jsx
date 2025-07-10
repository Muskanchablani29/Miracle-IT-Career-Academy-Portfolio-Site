import React, { useState, useEffect } from 'react';
import './AdminAttendance.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminAttendance = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDateRange, setShowDateRange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [summary, setSummary] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });
  const [viewMode, setViewMode] = useState('daily'); // daily, weekly, monthly

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('access');
        
        // Fetch batches
        const batchesResponse = await axios.get('http://localhost:8000/api/batches/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBatches(batchesResponse.data);

        // Fetch faculties
        const facultiesResponse = await axios.get('http://localhost:8000/api/users/', {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { role: 'faculty' }
        });
        setFaculties(facultiesResponse.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  // Extract unique courses from batches
  const courses = batches
    .filter(batch => batch.course)
    .reduce((uniqueCourses, batch) => {
      const courseId = batch.course.id;
      if (!uniqueCourses.some(course => String(course.id) === String(courseId))) {
        uniqueCourses.push({
          id: courseId,
          title: batch.course.title
        });
      }
      return uniqueCourses;
    }, []);

  const fetchStudents = async (batchId, date) => {
    try {
      if (!batchId) {
        setStudents([]);
        setAttendanceData({});
        setSummary({ totalStudents: 0, present: 0, absent: 0, percentage: 0 });
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const token = localStorage.getItem('access');
      
      // Fetch students by batch
      const response = await axios.get(`http://localhost:8000/api/students/`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: batchId === 'all' ? {} : { batch_id: batchId }
      });
      
      // Fetch attendance statistics for each student
      const studentsWithStats = await Promise.all(response.data.map(async (student) => {
        try {
          const statsResponse = await axios.get(`http://localhost:8000/api/student-attendance-stats/${student.id}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          return {
            ...student,
            attendanceStats: statsResponse.data
          };
        } catch (error) {
          return {
            ...student,
            attendanceStats: { percentage: 0, present_days: 0, total_working_days: 0 }
          };
        }
      }));
      
      setStudents(studentsWithStats);
      
      // Get attendance records for the selected date and batch
      const attendanceRecords = {};
      try {
        const attendanceResponse = await axios.get(`http://localhost:8000/api/attendance/`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: batchId === 'all'
            ? { date: selectedDate }
            : { date: selectedDate, batch: batchId }
        });
        
        attendanceResponse.data.forEach(record => {
          attendanceRecords[record.student] = {
            isPresent: record.is_present,
            remarks: record.remarks || ''
          };
        });
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
      
      // Initialize attendance data
      const initialAttendance = {};
      studentsWithStats.forEach(student => {
        initialAttendance[student.id] = attendanceRecords[student.id] || {
          isPresent: false,
          remarks: ''
        };
      });
      
      setAttendanceData(initialAttendance);
      
      // Calculate summary
      const presentCount = Object.values(initialAttendance).filter(item => item.isPresent).length;
      const totalCount = studentsWithStats.length;
      const absentCount = totalCount - presentCount;
      const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
      
      setSummary({
        totalStudents: totalCount,
        present: presentCount,
        absent: absentCount,
        percentage: attendancePercentage
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, isPresent) => {
    setAttendanceData(prev => {
      const updated = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          isPresent
        }
      };
      
      updateSummary(updated);
      return updated;
    });
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const updateSummary = (data = attendanceData) => {
    const total = students.length;
    const present = Object.values(data).filter(item => item.isPresent).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    setSummary({
      totalStudents: total,
      present,
      absent,
      percentage
    });
  };

  const markAllPresent = () => {
    const updatedData = {};
    students.forEach(student => {
      updatedData[student.id] = {
        ...attendanceData[student.id],
        isPresent: true
      };
    });
    
    setAttendanceData(updatedData);
    updateSummary(updatedData);
  };
  
  const markAllAbsent = () => {
    const updatedData = {};
    students.forEach(student => {
      updatedData[student.id] = {
        ...attendanceData[student.id],
        isPresent: false
      };
    });
    
    setAttendanceData(updatedData);
    updateSummary(updatedData);
  };

  const saveAttendance = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access');
      
      const promises = students.map(student => {
        return axios({
          method: 'post',
          url: 'http://localhost:8000/api/mark-attendance/',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            student_id: student.id,
            date: selectedDate,
            is_present: attendanceData[student.id]?.isPresent || false,
            remarks: attendanceData[student.id]?.remarks || ''
          }
        });
      });
      
      await Promise.all(promises);
      toast.success('✅ Attendance saved successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      fetchStudents(selectedBatch, selectedDate);
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('❌ Failed to save attendance. Please try again.', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadAttendanceReport = async () => {
    if (!selectedCourse || !selectedBatch) {
      toast.warning('Please select both course and batch first');
      return;
    }
    
    if (showDateRange) {
      try {
        setLoading(true);
        const token = localStorage.getItem('access');
        
        const studentsResponse = await axios.get(`http://localhost:8000/api/students/`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { batch: selectedBatch }
        });
        
        const attendanceResponse = await axios.get(`http://localhost:8000/api/attendance/`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { 
            batch: selectedBatch,
            start_date: startDate,
            end_date: endDate
          }
        });
        
        // Process data for CSV
        const studentMap = {};
        studentsResponse.data.forEach(student => {
          studentMap[student.id] = {
            enrollment_id: student.enrollment_id,
            name: student.user.username,
            present_days: 0,
            absent_days: 0,
            remarks: ''
          };
        });
        
        attendanceResponse.data.forEach(record => {
          if (studentMap[record.student]) {
            if (record.is_present) {
              studentMap[record.student].present_days += 1;
            } else {
              studentMap[record.student].absent_days += 1;
            }
            if (record.remarks) {
              studentMap[record.student].remarks = record.remarks;
            }
          }
        });
        
        // Create CSV
        const headers = ['Enrollment ID', 'Student Name', 'Present Days', 'Absent Days', 'Attendance %', 'Remarks'];
        const csvRows = [headers.join(',')];
        
        Object.values(studentMap).forEach(student => {
          const totalDays = student.present_days + student.absent_days;
          const attendancePercentage = totalDays > 0 
            ? Math.round((student.present_days / totalDays) * 100) 
            : 0;
            
          csvRows.push([
            student.enrollment_id,
            student.name,
            student.present_days,
            student.absent_days,
            `${attendancePercentage}%`,
            `"${student.remarks || ''}"`
          ].join(','));
        });
        
        const csvContent = csvRows.join('\n');
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `admin_attendance_${selectedBatch}_${startDate}_to_${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        setLoading(false);
      } catch (error) {
        console.error('Error downloading attendance report:', error);
        toast.error(`Failed to download report: ${error.message}`);
        setLoading(false);
      }
    } else {
      setShowDateRange(true);
    }
  };

  return (
    <div className="admin-attendance-container">
      <div className="admin-attendance-header">
        <h1 className="page-title">Admin Attendance Management</h1>
        <div className="view-mode-selector">
          <button 
            className={`mode-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            Daily View
          </button>
          <button 
            className={`mode-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Weekly View
          </button>
          <button 
            className={`mode-btn ${viewMode === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewMode('monthly')}
          >
            Monthly View
          </button>
        </div>
      </div>
      
      <div className="admin-attendance-content">
        <div className="admin-filters">
          <div className="filters-row">
            <div className="filter-group">
              <label>Faculty:</label>
              <select 
                className="filter-select"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="">All Faculties</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.username}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Course:</label>
              <select 
                className="filter-select"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedBatch('');
                  setStudents([]);
                }}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Batch:</label>
              <select 
                className="filter-select"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={!selectedCourse}
              >
                <option value="">Select Batch</option>
                {selectedCourse && <option value="all">All Students</option>}
                {batches
                  .filter(batch => batch.course && String(batch.course.id) === String(selectedCourse))
                  .map(batch => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                className="date-input" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <button 
                className="btn-search"
                onClick={() => {
                  if (selectedCourse && selectedBatch) {
                    fetchStudents(selectedBatch, selectedDate);
                  } else {
                    toast.warning('Please select course and batch');
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="admin-actions">
            {students.length > 0 && (
              <>
                <button className="btn-save" onClick={saveAttendance}>
                  Save Attendance
                </button>
                <button className="btn-download" onClick={downloadAttendanceReport}>
                  Download Report
                </button>
              </>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {students.length > 0 ? (
              <>
                <div className="admin-summary">
                  <div className="summary-card total">
                    <h3>Total Students</h3>
                    <p className="summary-number">{summary.totalStudents}</p>
                  </div>
                  <div className="summary-card present">
                    <h3>Present</h3>
                    <p className="summary-number">{summary.present}</p>
                    <p className="summary-percentage">{summary.percentage}%</p>
                  </div>
                  <div className="summary-card absent">
                    <h3>Absent</h3>
                    <p className="summary-number">{summary.absent}</p>
                    <p className="summary-percentage">{100 - summary.percentage}%</p>
                  </div>
                </div>
                
                <div className="admin-attendance-actions">
                  <button className="btn-mark-all present" onClick={markAllPresent}>
                    Mark All Present
                  </button>
                  <button className="btn-mark-all absent" onClick={markAllAbsent}>
                    Mark All Absent
                  </button>
                </div>
                
                <div className="admin-attendance-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Enrollment ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Overall Attendance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => {
                        const studentData = attendanceData[student.id] || { isPresent: false, remarks: '' };
                        const stats = student.attendanceStats || { percentage: 0, present_days: 0, total_working_days: 0 };
                        const attendancePercentage = stats.percentage || 0;
                        
                        let statusClass = 'status-poor';
                        if (attendancePercentage >= 85) statusClass = 'status-excellent';
                        else if (attendancePercentage >= 75) statusClass = 'status-good';
                        else if (attendancePercentage >= 60) statusClass = 'status-average';
                        
                        return (
                          <tr key={student.id}>
                            <td>{student.enrollment_id}</td>
                            <td className="student-name">{student.user.username}</td>
                            <td>
                              <select 
                                className={`status-select ${studentData.isPresent ? 'present' : 'absent'}`}
                                value={studentData.isPresent ? 'present' : 'absent'}
                                onChange={(e) => handleStatusChange(student.id, e.target.value === 'present')}
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                              </select>
                            </td>
                            <td>
                              <input 
                                type="text" 
                                placeholder="Add remarks" 
                                className="remarks-input"
                                value={studentData.remarks || ''}
                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              />
                            </td>
                            <td>
                              <div className="attendance-stats">
                                <span className={`attendance-percentage ${statusClass}`}>
                                  {attendancePercentage}%
                                </span>
                                <span className="attendance-details">
                                  ({stats.present_days}/{stats.total_working_days} days)
                                </span>
                              </div>
                            </td>
                            <td>
                              <button className="btn-view-details">
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="no-students">
                {selectedBatch ? 'No students found in this batch.' : 
                 selectedCourse ? 'Please select a batch from this course to view students.' : 
                 'Please select a course and batch to view students.'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;