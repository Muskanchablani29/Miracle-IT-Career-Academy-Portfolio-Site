import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../../api';
import './StudentList.css';

const CourseBatchCreation = ({ onClose, onSuccess, courseId, courseName }) => {
  const [batchName, setBatchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBatchNameChange = (e) => {
    setBatchName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchName.trim()) {
      setError('Batch name is required');
      return;
    }
    if (!courseId) {
      setError('Course ID is missing');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Create a batch associated with the selected course
      await userAxiosInstance.post('batches/', {
        name: batchName.trim(),
        course: courseId
      });
      setLoading(false);
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      console.error('Error creating course batch:', err);
      setError('Failed to create batch. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content batch-creation">
        <div className="modal-header">
          <h2>Create Batch for {courseName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="batchName">Batch Name</label>
            <input
              type="text"
              id="batchName"
              name="batchName"
              value={batchName}
              onChange={handleBatchNameChange}
              required
              disabled={loading}
              placeholder="Enter batch name"
            />
            <small className="form-hint">Example: "Morning Batch", "Weekend Batch", "Batch 2023-A"</small>
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
              {loading ? 'Creating...' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseBatchCreation;