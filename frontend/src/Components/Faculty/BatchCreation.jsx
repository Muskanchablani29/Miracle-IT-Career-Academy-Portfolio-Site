import React, { useState } from 'react';
import { createBatch } from '../../api';
import './StudentList.css';

const BatchCreation = ({ onClose, onSuccess }) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBatchNumberChange = (e) => {
    setBatchNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchNumber.trim()) {
      setError('Batch number is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createBatch({ name: batchNumber.trim() });
      setLoading(false);
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      console.error('Error creating batch:', err);
      setError('Failed to create batch. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content batch-creation">
        <div className="modal-header">
          <h2>Create Batch</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="batchNumber">Batch Number</label>
            <input
              type="text"
              id="batchNumber"
              name="batchNumber"
              value={batchNumber}
              onChange={handleBatchNumberChange}
              required
              disabled={loading}
              placeholder="Enter batch number"
            />
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

export default BatchCreation;
