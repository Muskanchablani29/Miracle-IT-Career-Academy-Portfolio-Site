import React from 'react';
import './ReceiptModal.css';

const ReceiptModal = ({ payment, onClose, canDownload = true }) => {
  if (!payment) return null;

  const handleDownload = () => {
    if (canDownload && payment.receipt_number) {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8000/api/fee-payments/download-receipt/?receipt_number=${payment.receipt_number}`;
      
      fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${payment.receipt_number}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => console.error('Download failed:', err));
    }
  };

  return (
    <div className="receipt-modal-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h2>ERP INSTITUTE</h2>
          <h3>Fee Payment Receipt</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="receipt-content">
          <div className="receipt-row">
            <span className="label">Receipt Number</span>
            <span className="value">{payment.receipt_number || 'REC-PENDING'}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Date & Time</span>
            <span className="value">{payment.payment_date ? new Date(payment.payment_date).toLocaleString() : new Date().toLocaleString()}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Student Name</span>
            <span className="value">{payment.student_name || 'Student'}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Enrollment ID</span>
            <span className="value">{payment.enrollment_id || 'ENR-PENDING'}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Course</span>
            <span className="value">{payment.course || 'Course Information'}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Payment Mode</span>
            <span className="value">{payment.payment_mode ? payment.payment_mode.replace('_', ' ').toUpperCase() : 'ONLINE'}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Transaction ID</span>
            <span className="value">{payment.transaction_id || 'TXN-PROCESSING'}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Status</span>
            <span className={`value status-${payment.status || 'success'}`}>{(payment.status || 'SUCCESS').toUpperCase()}</span>
          </div>
          <div className="receipt-row highlight">
            <span className="label">Amount Paid</span>
            <span className="value">₹{payment.amount ? payment.amount.toLocaleString() : '0'}</span>
          </div>
        </div>
        
        <div className="receipt-footer">
          <p>This is a computer generated receipt.</p>
          <p>For queries: admin@erpinstitute.com | +91-XXXXXXXXXX</p>
          
          <div className="receipt-actions">
            {canDownload && (
              <button className="btn-primary" onClick={handleDownload}>
                Download PDF
              </button>
            )}
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;