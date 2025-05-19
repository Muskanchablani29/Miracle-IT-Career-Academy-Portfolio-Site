import React, { useState, useEffect } from 'react';
import { createStudentAccount } from '../../api';
import './StudentList.css';

const CreateStudent = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    enrollment_id: '',
    date_of_birth: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextEnrollmentId, setNextEnrollmentId] = useState(() => {
    // Get the last used enrollment ID from localStorage or use default
    const savedId = localStorage.getItem('lastEnrollmentId');
    if (savedId) {
      // Increment the saved ID by 1
      const currentNum = parseInt(savedId.replace('MIRA', ''));
      const nextNum = currentNum + 1;
      return `MIRA${nextNum.toString().padStart(4, '0')}`;
    }
    return 'MIRA0001';
  });

  useEffect(() => {
    // Update form data with the enrollment ID
    setFormData(prev => ({
      ...prev,
      enrollment_id: nextEnrollmentId
    }));
  }, [nextEnrollmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting student data:', formData);
      const response = await createStudentAccount(formData);
      console.log('Student creation response:', response);
      setLoading(false);
      
      // Increment enrollment ID for next student
      const currentNum = parseInt(nextEnrollmentId.replace('MIRA', ''));
      const nextNum = currentNum + 1;
      const newEnrollmentId = `MIRA${nextNum.toString().padStart(4, '0')}`;
      
      // Save to localStorage for persistence
      localStorage.setItem('lastEnrollmentId', nextEnrollmentId);
      setNextEnrollmentId(newEnrollmentId);
      
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      console.error('Student creation error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      setLoading(false);
      setError(err.response?.data?.detail || err.message || 'Failed to create student account.');
    }
  };

  // Format date as DD/MM/YYYY for display
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Student Account</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="enrollment_id">Enrollment ID</label>
            <input
              type="text"
              id="enrollment_id"
              name="enrollment_id"
              value={formData.enrollment_id}
              onChange={handleChange}
              required
              readOnly
            />
            <small className="form-hint">Auto-generated unique ID</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
            <small className="form-hint">
              Please enter the student's date of birth

            </small>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;