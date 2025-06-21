import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaDownload, FaExclamationTriangle, FaCreditCard } from 'react-icons/fa';
import './StudentDashboard.css';
import { userAxiosInstance } from '../../api';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const StudentFeeManagement = () => {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        setLoading(true);
        
        // Load Razorpay script
        await loadRazorpayScript();
        
        // Import the API function instead of using axios directly
        const { getStudentFeeDetails } = require('../../api');
        const feeData = await getStudentFeeDetails();
        
        console.log('Fee data received:', feeData);
        setFeeData(feeData);
        
        // Set default payment amount to due amount
        if (feeData && feeData.due_amount) {
          setPaymentAmount(feeData.due_amount);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchFeeDetails:', err);
        if (err.response) {
          if (err.response.status === 404) {
            setError('No fee structure assigned to your course. Please contact the admin.');
          } else if (err.response.status === 401) {
            setError('Please login to view fee details.');
          } else {
            setError(err.response.data?.error || 'Failed to load fee details.');
          }
        } else {
          setError('Failed to load fee details. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchFeeDetails();
  }, []);

  const handleDownloadReceipt = async (receiptNumber) => {
    try {
      const { downloadReceipt } = require('../../api');
      const response = await downloadReceipt(receiptNumber);
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${receiptNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      alert('Failed to download receipt. Please try again later.');
    }
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    try {
      // Import the API functions
      const { makePayment, getStudentFeeDetails, createRazorpayOrder, verifyRazorpayPayment } = require('../../api');
      
      // For Razorpay integration
      if (paymentMethod === 'razorpay') {
        try {
          // Create Razorpay order
          const orderData = await createRazorpayOrder(paymentAmount);
          
          // Initialize Razorpay
          const options = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'ERP Portal',
            description: 'Fee Payment',
            order_id: orderData.id,
            prefill: {
              name: orderData.student_name,
              email: orderData.student_email,
              contact: orderData.contact
            },
            theme: {
              color: '#3399cc'
            },
            handler: async function (response) {
              try {
                // Verify payment
                const verificationData = {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: paymentAmount
                };
                
                const verifyResponse = await verifyRazorpayPayment(verificationData);
                
                // Refresh fee data
                const updatedFeeData = await getStudentFeeDetails();
                setFeeData(updatedFeeData);
                
                setShowPaymentModal(false);
                setProcessingPayment(false);
                alert(`Payment successful! Receipt Number: ${verifyResponse.receipt_number}`);
                
              } catch (verifyError) {
                console.error('Payment verification error:', verifyError);
                alert('Payment completed but verification failed. Please contact admin.');
                setProcessingPayment(false);
              }
            },
            modal: {
              ondismiss: function() {
                setProcessingPayment(false);
              }
            }
          };
          
          // Check if Razorpay is loaded
          if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            // Fallback - simulate payment for demo
            const paymentData = {
              student_fee: feeData.fee_details.id,
              amount: paymentAmount,
              payment_mode: 'online',
              transaction_id: `TXN-${Date.now()}`,
              status: 'success',
              remarks: 'Payment made through student portal (Demo)'
            };
            
            const paymentResponse = await makePayment(paymentData);
            const updatedFeeData = await getStudentFeeDetails();
            setFeeData(updatedFeeData);
            
            setShowPaymentModal(false);
            setProcessingPayment(false);
            alert('Payment successful! (Demo Mode)');
          }
          
        } catch (orderError) {
          console.error('Order creation error:', orderError);
          alert('Failed to create payment order. Please try again.');
          setProcessingPayment(false);
        }
        
      } else if (paymentMethod === 'bank_transfer') {
        // For bank transfer, record as pending payment
        const paymentData = {
          student_fee: feeData.fee_details.id,
          amount: paymentAmount,
          payment_mode: 'bank_transfer',
          transaction_id: '',
          status: 'pending',
          remarks: 'Bank transfer initiated through student portal'
        };
        
        // Make API call to record payment
        const paymentResponse = await makePayment(paymentData);
        console.log('Payment response:', paymentResponse);
        
        // Refresh fee data
        const updatedFeeData = await getStudentFeeDetails();
        setFeeData(updatedFeeData);
        
        setShowPaymentModal(false);
        setProcessingPayment(false);
        alert('Payment request submitted successfully! Your payment will be verified by the admin.');
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
          <p><strong>Structure Name:</strong> {feeData.fee_details?.fee_structure_name || 'N/A'}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge ${feeData.fee_details?.status || 'unknown'}`}>
              {(feeData.fee_details?.status || 'unknown').replace('_', ' ')}
            </span>
          </p>
          <p><strong>Assigned Date:</strong> {feeData.fee_details?.assigned_date ? new Date(feeData.fee_details.assigned_date).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
      
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
            {feeData.installments && feeData.installments.length > 0 ? (
              feeData.installments.map((installment, index) => {
                // Calculate if installment is paid based on amount_paid
                const isPaid = index === 0 ? 
                  feeData.amount_paid >= installment.amount : 
                  feeData.amount_paid >= feeData.installments.slice(0, index + 1).reduce((sum, inst) => sum + inst.amount, 0);
                
                // Check if overdue
                const isOverdue = !isPaid && new Date(installment.due_date) < new Date();
                
                return (
                  <tr key={installment.id}>
                    <td>Installment {installment.sequence || index + 1}</td>
                    <td>₹{installment.amount.toLocaleString()}</td>
                    <td>{new Date(installment.due_date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${isPaid ? 'paid' : isOverdue ? 'overdue' : 'pending'}`}>
                        {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No installment schedule available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
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
                      title="Download Receipt"
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
                  <option value="razorpay">💳 Online Payment (Credit/Debit Card/UPI/Net Banking)</option>
                  <option value="bank_transfer">🏦 Bank Transfer</option>
                </select>
              </div>
              
              {paymentMethod === 'razorpay' && (
                <div className="payment-info">
                  <h3>🔒 Secure Online Payment</h3>
                  <p>You will be redirected to Razorpay's secure payment gateway to complete your transaction.</p>
                  <ul>
                    <li>✅ Credit/Debit Cards accepted</li>
                    <li>✅ UPI payments supported</li>
                    <li>✅ Net Banking available</li>
                    <li>✅ Wallets supported</li>
                  </ul>
                </div>
              )}
              
              {paymentMethod === 'bank_transfer' && (
                <div className="bank-details">
                  <h3>Bank Account Details</h3>
                  <div className="bank-info">
                    <p><strong>Account Name:</strong> ERP Portal</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                    <p><strong>IFSC Code:</strong> ABCD0001234</p>
                    <p><strong>Bank:</strong> Example Bank</p>
                  </div>
                  <p className="note">📝 Note: After making the payment, please submit this form. Your payment will be verified by the admin.</p>
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
                  {processingPayment ? 'Processing...' : paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Submit Payment Request'}
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