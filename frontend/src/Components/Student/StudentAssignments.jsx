import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../../api';
import './StudentAssignments.css';
import { 
  FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle, 
  FaCalendarAlt, FaGraduationCap, FaFileAlt, FaUpload,
  FaStar, FaAward, FaChartLine, FaBookOpen, FaLightbulb,
  FaRocket, FaFire, FaGem, FaTarget, FaArrowRight
} from 'react-icons/fa';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_assignments: 0,
    submitted_count: 0,
    pending_count: 0
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    submission_text: '',
    file_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await userAxiosInstance.get('student-assignments/');
      setAssignments(response.data.assignments);
      setStats({
        total_assignments: response.data.total_assignments,
        submitted_count: response.data.submitted_count,
        pending_count: response.data.pending_count
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      setSubmitting(true);
      await userAxiosInstance.post('assignment-submissions/', {
        assignment: assignmentId,
        submission_text: submissionData.submission_text,
        file_url: submissionData.file_url
      });
      
      // Refresh assignments
      await fetchAssignments();
      setSelectedAssignment(null);
      setSubmissionData({ submission_text: '', file_url: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getStatusColor = (assignment) => {
    if (assignment.submission) {
      switch (assignment.submission.status) {
        case 'submitted': return '#2196F3';
        case 'reviewed': return '#FF9800';
        case 'graded': return '#4CAF50';
        default: return '#757575';
      }
    }
    return assignment.is_overdue ? '#F44336' : '#FF9800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="assignments-loading">
        <div className="loading-spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignments-error">
        <FaExclamationTriangle />
        <p>{error}</p>
        <button onClick={fetchAssignments} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="student-assignments">
      <div className="assignments-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-badge">
              <FaTasks className="badge-icon" />
              <span>Assignments Hub</span>
            </div>
            <h1 className="page-title">My Assignments</h1>
            <p className="page-subtitle">Track and submit your assignments</p>
          </div>
          <div className="header-stats">
            <div className="stat-card total">
              <div className="stat-icon">
                <FaBookOpen />
              </div>
              <div className="stat-info">
                <span className="stat-number">{stats.total_assignments}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
            <div className="stat-card submitted">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-info">
                <span className="stat-number">{stats.submitted_count}</span>
                <span className="stat-label">Submitted</span>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-info">
                <span className="stat-number">{stats.pending_count}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="assignments-content">
        {assignments.length === 0 ? (
          <div className="no-assignments">
            <div className="empty-icon">
              <FaLightbulb />
            </div>
            <h3>No Assignments Yet</h3>
            <p>Your assignments will appear here once they're assigned by your instructor.</p>
          </div>
        ) : (
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="assignment-card">
                <div className="card-header">
                  <div className="assignment-meta">
                    <div 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(assignment.difficulty) }}
                    >
                      {assignment.difficulty}
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(assignment) }}
                    >
                      {assignment.submission ? assignment.submission.status : 
                       assignment.is_overdue ? 'overdue' : 'pending'}
                    </div>
                  </div>
                  <div className="assignment-actions">
                    {assignment.is_overdue && !assignment.submission && (
                      <FaExclamationTriangle className="overdue-icon" />
                    )}
                    {assignment.submission?.grade && (
                      <div className="grade-display">
                        <FaStar />
                        <span>{assignment.submission.grade}/100</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="assignment-title">{assignment.title}</h3>
                  <p className="assignment-description">{assignment.description}</p>
                  
                  <div className="assignment-details">
                    <div className="detail-item">
                      <FaCalendarAlt />
                      <span>Due: {formatDate(assignment.due_date)}</span>
                    </div>
                    <div className="detail-item">
                      <FaClock />
                      <span>
                        {assignment.is_overdue ? 'Overdue' : 
                         `${Math.ceil((new Date(assignment.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
                      </span>
                    </div>
                  </div>

                  {assignment.submission ? (
                    <div className="submission-info">
                      <div className="submission-status">
                        <FaCheckCircle />
                        <span>Submitted on {formatDate(assignment.submission.submission_date)}</span>
                      </div>
                      {assignment.submission.feedback && (
                        <div className="feedback">
                          <h4>Feedback:</h4>
                          <p>{assignment.submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="submission-actions">
                      <button 
                        className="submit-btn"
                        onClick={() => setSelectedAssignment(assignment)}
                        disabled={assignment.is_overdue}
                      >
                        <FaUpload />
                        <span>{assignment.is_overdue ? 'Overdue' : 'Submit Assignment'}</span>
                        <FaArrowRight />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="submission-modal-overlay">
          <div className="submission-modal">
            <div className="modal-header">
              <h3>Submit Assignment</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedAssignment(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="assignment-info">
                <h4>{selectedAssignment.title}</h4>
                <p>Due: {formatDate(selectedAssignment.due_date)}</p>
              </div>
              
              <div className="submission-form">
                <div className="form-group">
                  <label>Submission Text</label>
                  <textarea
                    value={submissionData.submission_text}
                    onChange={(e) => setSubmissionData({
                      ...submissionData,
                      submission_text: e.target.value
                    })}
                    placeholder="Enter your submission details..."
                    rows={6}
                  />
                </div>
                
                <div className="form-group">
                  <label>File URL (Optional)</label>
                  <input
                    type="url"
                    value={submissionData.file_url}
                    onChange={(e) => setSubmissionData({
                      ...submissionData,
                      file_url: e.target.value
                    })}
                    placeholder="https://github.com/your-repo or drive link..."
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setSelectedAssignment(null)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                disabled={submitting || !submissionData.submission_text.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;