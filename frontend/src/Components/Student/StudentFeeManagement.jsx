import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaDownload, FaExclamationTriangle, FaCreditCard } from 'react-icons/fa';
import './StudentDashboard.css';

const StudentFeeManagement = () => {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Mock data for development
  const mockFeeData = {
    total_amount: 45000,
    amount_paid: 30000,
    due_amount: 15000,
    next_due_date: '2023-08-15',
    fee_details: {
      id: 1,
      student_name: 'John Smith',
      fee_structure_name: 'Full Stack Web Development - 2023',
      status: 'partially_paid',
      assigned_date: '2023-01-15'
    },
    installments: [
      { id: 1, amount: 15000, due_date: '2023-01-15', is_paid: true },
      { id: 2, amount: 15000, due_date: '2023-04-15', is_paid: true },
      { id: 3, amount: 15000, due_date: '2023-08-15', is_paid: false }
    ],
    payment_history: [
      { id: 1, receipt_number: 'REC-001', payment_date: '2023-01-15', amount: 15000, payment_mode: 'online', status: 'success' },
      { id: 2, receipt_number: 'REC-002', payment_date: '2023-04-15', amount: 15000, payment_mode: 'online', status: 'success' }
    ]
  };

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        setLoading(true);
        
        try {
          const response = await axios.get('/api/student-fee-details/');
          setFeeData(response.data);
          
          // Set default payment amount to due amount
          if (response.data && response.data.due_amount) {
            setPaymentAmount(response.data.due_amount);
          }
        } catch (err) {
          console.error('Error fetching fee details:', err);
          // Use mock data if API call fails
          setFeeData(mockFeeData);
          setPaymentAmount(mockFeeData.due_amount);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchFeeDetails:', err);
        setError('Failed to load fee details. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeeDetails();
  }, []);

  const handleDownloadReceipt = async (receiptNumber) => {
    try {
      const response = await axios.get(`/api/fee-payments/download-receipt/?receipt_number=${receiptNumber}`, {
        responseType: 'blob'
      });
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${receiptNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading receipt:', err);
      alert('Receipt download would happen here (mock)');
    }
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    try {
      // For Razorpay integration (mock for now)
      if (paymentMethod === 'razorpay') {
        // Simulate payment processing
        setTimeout(() => {
          // Update fee data with new payment
          const updatedFeeData = {
            ...feeData,
            amount_paid: feeData.amount_paid + paymentAmount,
            due_amount: feeData.due_amount - paymentAmount,
            payment_history: [
              ...feeData.payment_history,
              {
                id: feeData.payment_history.length + 1,
                receipt_number: `REC-00${feeData.payment_history.length + 1}`,
                payment_date: new Date().toISOString(),
                amount: paymentAmount,
                payment_mode: 'online',
                status: 'success'
              }
            ]
          };
          
          // Update installments if applicable
          if (updatedFeeData.installments) {
            for (let i = 0; i < updatedFeeData.installments.length; i++) {
              if (!updatedFeeData.installments[i].is_paid) {
                updatedFeeData.installments[i].is_paid = true;
                break;
              }
            }
          }
          
          setFeeData(updatedFeeData);
          setShowPaymentModal(false);
          setProcessingPayment(false);
          alert('Payment successful! (mock)');
        }, 1500);
      } else {
        // For other payment methods (bank transfer, etc.)
        setTimeout(() => {
          alert('Payment request submitted successfully! Your payment will be verified by the admin. (mock)');
          setShowPaymentModal(false);
          setProcessingPayment(false);
        }, 1000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again or contact the admin.');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading fee details...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <FaExclamationTriangle />
        <p>{error}</p>
      </div>
    );
  }

  if (!feeData) {
    return (
      <div className="no-data-message">
        <FaExclamationTriangle />
        <p>No fee records found. Please contact the admin.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1><FaMoneyBillWave /> Fee Management</h1>
      
      <div className="fee-summary">
        <div className="fee-card">
          <h3>Total Fees</h3>
          <p className="fee-amount">₹{feeData.total_amount.toLocaleString()}</p>
        </div>
        <div className="fee-card">
          <h3>Paid</h3>
          <p className="fee-amount">₹{feeData.amount_paid.toLocaleString()}</p>
        </div>
        <div className="fee-card">
          <h3>Due</h3>
          <p className="fee-amount">₹{feeData.due_amount.toLocaleString()}</p>
        </div>
        <div className="fee-card">
          <h3>Next Due Date</h3>
          <p className="fee-date">
            {feeData.next_due_date 
              ? new Date(feeData.next_due_date).toLocaleDateString() 
              : 'No upcoming due date'}
          </p>
        </div>
      </div>
      
      <div className="fee-details-section">
        <h2>Fee Structure Details</h2>
        <div className="fee-structure-details">
          <p><strong>Structure Name:</strong> {feeData.fee_details.fee_structure_name}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge ${feeData.fee_details.status}`}>
              {feeData.fee_details.status.replace('_', ' ')}
            </span>
          </p>
          <p><strong>Assigned Date:</strong> {new Date(feeData.fee_details.assigned_date).toLocaleDateString()}</p>
        </div>
      </div>
      
      {feeData.installments && (
        <div className="installments-section">
          <h2>Installment Schedule</h2>
          <table className="installments-table">
            <thead>
              <tr>
                <th>Installment</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {feeData.installments.length > 0 ? (
                feeData.installments.map((installment, index) => (
                  <tr key={installment.id}>
                    <td>Installment {index + 1}</td>
                    <td>₹{installment.amount.toLocaleString()}</td>
                    <td>{new Date(installment.due_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${installment.is_paid ? 'paid' : new Date(installment.due_date) < new Date() ? 'overdue' : 'pending'}`}>
                        {installment.is_paid ? 'Paid' : new Date(installment.due_date) < new Date() ? 'Overdue' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No installment schedule available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="payment-history-section">
        <h2>Payment History</h2>
        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeData.payment_history && feeData.payment_history.length > 0 ? (
              feeData.payment_history.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.receipt_number}</td>
                  <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td>₹{payment.amount.toLocaleString()}</td>
                  <td>{payment.payment_mode.replace('_', ' ')}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleDownloadReceipt(payment.receipt_number)}
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No payment records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {feeData.due_amount > 0 && (
        <div className="payment-options">
          <h2>Make Payment</h2>
          <button className="btn-primary" onClick={handlePayNow}>
            <FaCreditCard /> Pay Now
          </button>
        </div>
      )}
      
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <h2>Make Payment</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label>Amount to Pay (₹)</label>
                <input 
                  type="number" 
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min="1"
                  max={feeData.due_amount} 
                  required 
                />
                <p className="helper-text">Maximum amount: ₹{feeData.due_amount.toLocaleString()}</p>
              </div>
              
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="razorpay">Credit/Debit Card/UPI (Razorpay)</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              
              {paymentMethod === 'bank_transfer' && (
                <div className="bank-details">
                  <h3>Bank Account Details</h3>
                  <p><strong>Account Name:</strong> ERP Portal</p>
                  <p><strong>Account Number:</strong> 1234567890</p>
                  <p><strong>IFSC Code:</strong> ABCD0001234</p>
                  <p><strong>Bank:</strong> Example Bank</p>
                  <p className="note">Note: After making the payment, please submit this form. Your payment will be verified by the admin.</p>
                </div>
              )}
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={processingPayment || !paymentMethod || paymentAmount <= 0 || paymentAmount > feeData.due_amount}
                >
                  {processingPayment ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFeeManagement;