import React, { useState, useEffect } from 'react';
import './StudentAttendance.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentAttendance = () => {
  // Function to download attendance report
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const downloadAttendanceReport = async () => {
    if (!selectedBatch) return;
    
    if (showDateRange) {
      try {
        setLoading(true);
        const token = localStorage.getItem('access');
        
        // Get students for the selected batch
        const studentsResponse = await axios.get(`http://localhost:8000/api/students/`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { batch: selectedBatch }
        });
        
        // Get attendance records for the date range
        const attendanceResponse = await axios.get(`http://localhost:8000/api/attendance/`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { 
            batch: selectedBatch,
            start_date: startDate,
            end_date: endDate
          }
        });
        
        // Process data to create attendance report
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
        
        // Count present and absent days
        attendanceResponse.data.forEach(record => {
          if (studentMap[record.student]) {
            if (record.is_present) {
              studentMap[record.student].present_days += 1;
            } else {
              studentMap[record.student].absent_days += 1;
            }
            // Keep the most recent remark
            if (record.remarks) {
              studentMap[record.student].remarks = record.remarks;
            }
          }
        });
        
        // Create CSV content
        const headers = ['Enrollment ID', 'Student Name', 'Present Days', 'Absent Days', 'Attendance %', 'Remarks'];
        const csvRows = [];
        csvRows.push(headers.join(','));
        
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
        
        // Create download link with BOM for Excel compatibility
        const BOM = "\uFEFF"; // UTF-8 BOM for Excel
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${selectedBatch}_${startDate}_to_${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        setLoading(false);
      } catch (error) {
        console.error('Error downloading attendance report:', error);
        console.error('Error details:', error.response?.data || error.message);
        toast.error(`Failed to download report: ${error.message}`);
        setLoading(false);
      }
    } else {
      setShowDateRange(true);
    }
  };
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [summary, setSummary] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    percentage: 0
  });
  const [message, setMessage] = useState('');

  // Fetch batches on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/batches/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, []);

  // Only fetch students when Search button is clicked, not automatically
  // This removes the auto-fetch on batch selection
  useEffect(() => {
    // Clear students when batch is deselected
    if (!selectedBatch) {
      setStudents([]);
      setAttendanceData({});
      setSummary({
        totalStudents: 0,
        present: 0,
        absent: 0,
        percentage: 0
      });
    }
  }, [selectedBatch]);

  const fetchStudents = async (batchId, date) => {
    try {
      if (!batchId) {
        setStudents([]);
        setAttendanceData({});
        setSummary({
          totalStudents: 0,
          present: 0,
          absent: 0,
          percentage: 0
        });
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const token = localStorage.getItem('access');
      
      // Fetch students by batch with explicit batch_id parameter
      // Using batch_id as a query parameter
      const response = await axios.get(`http://localhost:8000/api/students/`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { 
          batch: batchId  // Changed from batch_id to batch
        }
      });
      
      // Fetch attendance for the selected date and batch
      const attendanceResponse = await axios.get(`http://localhost:8000/api/attendance/`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { 
          date: date, 
          batch: batchId  // Changed from batch_id to batch
        }
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
          console.error(`Error fetching stats for student ${student.id}:`, error);
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
          params: { 
            date: selectedDate,
            batch: batchId  // Changed from batch_id to batch
          }
        });
        
        // Create a map of student_id to attendance record
        attendanceResponse.data.forEach(record => {
          attendanceRecords[record.student] = {
            isPresent: record.is_present,
            remarks: record.remarks || ''
          };
        });
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      }
      
      // Initialize attendance data with existing records or defaults
      const initialAttendance = {};
      studentsWithStats.forEach(student => {
        initialAttendance[student.id] = attendanceRecords[student.id] || {
          isPresent: false,
          remarks: ''
        };
      });
      
      setAttendanceData(initialAttendance);
      
      // Calculate initial summary based on the fetched attendance data
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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
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
      
      // Update summary after changing status
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

  const saveAttendance = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('access');
      
      // Save attendance for all students
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
      // Show toast notification
      toast.success('✅ Attendance saved successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Refresh data
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

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Student Attendance</h1>
      <div className="dashboard-content">
        <div className="attendance-filters">
          <div className="filter-group">
            <label>Batch:</label>
            <select 
              className="filter-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Select Batch</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name} {batch.course ? `- ${batch.course.title}` : ''}
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
              onChange={handleDateChange}
            />
          </div>
          <div className="filter-group">
            <button 
              className="btn-secondary"
              onClick={() => {
                if (selectedBatch) {
                  console.log(`Searching for batch: ${selectedBatch}`);
                  fetchStudents(selectedBatch, selectedDate);
                } else {
                  toast.warning('Please select a batch first');
                }
              }}
            >
              Search
            </button>
          </div>
          <div className="filter-group ml-auto">
            {showDateRange ? (
              <div className="date-range-container">
                <div className="date-range-inputs">
                  <div className="filter-group">
                    <label>Start:</label>
                    <input 
                      type="date" 
                      className="date-input" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="filter-group">
                    <label>End:</label>
                    <input 
                      type="date" 
                      className="date-input" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  className="btn-download"
                  onClick={downloadAttendanceReport}
                  disabled={!selectedBatch}
                >
                  Download
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setShowDateRange(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                className="btn-download"
                onClick={downloadAttendanceReport}
                disabled={!selectedBatch}
              >
                Download Report
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {message && <div className="message">{message}</div>}
            
            {students.length > 0 ? (
              <>
                <div className="attendance-summary">
                  <div className="summary-card">
                    <h3>Total Students</h3>
                    <p className="summary-number">{summary.totalStudents}</p>
                  </div>
                  <div className="summary-card">
                    <h3>Present</h3>
                    <p className="summary-number">{summary.present}</p>
                    <p className="summary-percentage">{summary.percentage}%</p>
                  </div>
                  <div className="summary-card">
                    <h3>Absent</h3>
                    <p className="summary-number">{summary.absent}</p>
                    <p className="summary-percentage">{100 - summary.percentage}%</p>
                  </div>
                </div>
                
                <div className="attendance-actions">
                  <button className="btn-secondary" onClick={markAllPresent}>Mark All Present</button>
                  <button className="btn-primary" onClick={saveAttendance}>Save Attendance</button>
                </div>
                
                <div className="attendance-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Enrollment ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Admission Date</th>
                        <th>Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => {
                        const studentData = attendanceData[student.id] || { isPresent: false, remarks: '' };
                        const admissionDate = student.admission_date ? 
                          new Date(student.admission_date).toLocaleDateString() : 'N/A';
                        
                        // Get attendance stats
                        const stats = student.attendanceStats || { percentage: 0, present_days: 0, total_working_days: 0 };
                        const attendancePercentage = stats.percentage || 0;
                        
                        // Determine status class based on percentage
                        let statusClass = 'status-poor';
                        if (attendancePercentage >= 85) statusClass = 'status-excellent';
                        else if (attendancePercentage >= 75) statusClass = 'status-good';
                        else if (attendancePercentage >= 60) statusClass = 'status-average';
                        
                        return (
                          <tr key={student.id}>
                            <td>{student.enrollment_id}</td>
                            <td>{student.user.username}</td>
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
                            <td>{admissionDate}</td>
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="no-students">
                {selectedBatch ? 'No students found in this batch.' : 'Please select a batch to view students.'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;