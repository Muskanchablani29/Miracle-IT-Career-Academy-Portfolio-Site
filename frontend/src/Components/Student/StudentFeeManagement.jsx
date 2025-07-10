import React, { useState, useEffect } from 'react';
import { 
  FaMoneyBillWave, 
  FaDownload, 
  FaExclamationTriangle, 
  FaCreditCard,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaChartLine,
  FaReceipt,
  FaUniversity,
  FaShieldAlt
} from 'react-icons/fa';
import './StudentFeeManagement.css';
import { userAxiosInstance } from '../../api';
import ReceiptModal from '../Common/ReceiptModal';

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
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [availableInstallments, setAvailableInstallments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  
  const refreshFeeData = async () => {
    try {
      const response = await userAxiosInstance.get('student-fees/details/', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      setFeeData(response.data);
      console.log('Fee data refreshed:', response.data.installments);
    } catch (error) {
      console.error('Error refreshing fee data:', error);
    }
  };

  const fetchFeeDetails = async () => {
    try {
      setLoading(true);
      
      // Load Razorpay script
      await loadRazorpayScript();
      
      // Import the API function instead of using axios directly
      const { getStudentFeeDetails } = require('../../api');
      const feeData = await getStudentFeeDetails();
      console.log('Fetched installments:', feeData.installments);
      
      console.log('Fee data received:', feeData);
      setFeeData(feeData);
      
      // Set default payment amount to due amount
      if (feeData && feeData.due_amount) {
        setPaymentAmount(feeData.due_amount);
      }
      
      // Fetch notifications - temporarily disabled
      // await fetchNotifications();
      
      setError(null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeDetails();
    
    // Set up periodic refresh to get real-time updates
    const interval = setInterval(() => {
      fetchFeeDetails();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleDownloadReceipt = async (receiptNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/fee-payments/download-receipt/?receipt_number=${receiptNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/pdf')) {
          // Handle PDF download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `receipt-${receiptNumber}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Show success message
          alert('Receipt downloaded successfully!');
        } else {
          // Handle JSON response (fallback)
          const data = await response.json();
          console.log('Receipt data:', data);
          alert('Receipt data retrieved. PDF generation not available.');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download receipt');
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert(`Failed to download receipt: ${error.message}`);
    }
  };

  const handlePayNow = (installment = null) => {
    if (installment && installment.is_paid) {
      alert('This installment has already been paid!');
      return;
    }
    
    // Get unpaid installments
    const unpaidInstallments = feeData.installments ? 
      feeData.installments.filter(inst => !inst.is_paid) : [];
    
    setAvailableInstallments(unpaidInstallments);
    setSelectedInstallment(installment);
    
    if (installment) {
      setPaymentAmount(installment.amount);
    } else if (unpaidInstallments.length > 0) {
      // Default to first unpaid installment
      setSelectedInstallment(unpaidInstallments[0]);
      setPaymentAmount(unpaidInstallments[0].amount);
    } else {
      setPaymentAmount(feeData.due_amount);
    }
    
    setShowPaymentModal(true);
  };
  
  const fetchNotifications = async () => {
    // Temporarily disabled to prevent 401 errors
    setNotifications([]);
  };
  
  const markNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/student-notifications/${notificationId}/mark-read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? {...n, is_read: true} : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
          
          // Check if this is demo mode
          if (orderData.demo_mode || orderData.key_id === 'demo_key_only') {
            // Demo mode - simulate payment
            const { makeDemoPayment } = require('../../api');
            const paymentResponse = await makeDemoPayment(
              paymentAmount, 
              selectedInstallment ? selectedInstallment.id : null
            );
            
            setShowPaymentModal(false);
            setProcessingPayment(false);
            
            // Refresh fee data after demo payment
            await refreshFeeData();
            setTimeout(async () => {
              await fetchFeeDetails();
            }, 500);
            
            const downloadReceipt = window.confirm(
              `Payment successful! Receipt: ${paymentResponse.payment.receipt_number}\n\n(Demo Mode - No actual payment processed)\n\nWould you like to download the receipt now?`
            );
            
            if (downloadReceipt) {
              await handleDownloadReceipt(paymentResponse.payment.receipt_number);
            }
            return;
          }
          
          // Initialize Razorpay
          const options = {
            key: orderData.key_id,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'ERP Portal',
            description: 'Fee Payment',
            order_id: orderData.order_id,
            prefill: {
              name: orderData.student_name,
              email: orderData.student_email,
              contact: orderData.student_contact
            },
            theme: {
              color: '#FF4500'
            },
            handler: async function (response) {
              try {
                // Verify payment
                const verificationData = {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: orderData.amount,
                  installment_id: selectedInstallment ? selectedInstallment.id : null
                };
                
                const { verifyInstallmentPayment } = require('../../api');
                const verifyResponse = await verifyInstallmentPayment(verificationData);
                
                setShowPaymentModal(false);
                setProcessingPayment(false);
                
                // Show success message with download option
                const downloadReceipt = window.confirm(
                  `Payment successful! Receipt: ${verifyResponse.receipt_number}\n\nWould you like to download the receipt now?`
                );
                
                // Refresh fee data after payment
                await refreshFeeData();
                
                // Show updated data with delay
                setTimeout(async () => {
                  await fetchFeeDetails();
                }, 2000);
                
                if (downloadReceipt) {
                  setCurrentReceipt({
                    receipt_number: verifyResponse.receipt_number,
                    payment_date: new Date().toISOString(),
                    student_name: feeData.fee_details?.student_name || 'Student',
                    enrollment_id: feeData.fee_details?.enrollment_id || 'N/A',
                    course: feeData.fee_details?.course || 'N/A',
                    amount: paymentAmount,
                    payment_mode: 'online',
                    transaction_id: response.razorpay_payment_id,
                    status: 'success'
                  });
                  setShowReceiptModal(true);
                }
                
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
            alert('Payment gateway failed to load. Please refresh the page and try again.');
            setProcessingPayment(false);
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
          installment_id: selectedInstallment ? selectedInstallment.id : null,
          amount: paymentAmount,
          payment_mode: 'bank_transfer',
          transaction_id: '',
          status: 'pending',
          remarks: 'Bank transfer initiated through student portal'
        };
        
        // Make API call to record payment
        const paymentResponse = await makePayment(paymentData);
        console.log('Payment response:', paymentResponse);
        
        setShowPaymentModal(false);
        setProcessingPayment(false);
        
        // Refresh fee data after bank transfer
        await refreshFeeData();
        setTimeout(async () => {
          await fetchFeeDetails();
        }, 500);
        
        const receiptNumber = paymentResponse.payment.receipt_number;
        alert(`Payment request submitted successfully!\nReference: ${receiptNumber}\n\nYour payment will be verified by the admin.`);
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
    <div className="dashboard-container-fee">
      <div className="page-header">
        <div>
          <h1><FaMoneyBillWave /> Fee Management</h1>
          <p className="page-subtitle">Manage your fee payments and track your financial progress</p>
        </div>
        <button onClick={fetchFeeDetails} className="refresh-btn" title="Refresh Data">
          🔄 Refresh
        </button>
      </div>
      
      <div className="fee-summary">
        <div className="fee-card">
          <div className="card-icon">
            <FaChartLine />
          </div>
          <h3>Total Fees</h3>
          <p className="fee-amount">₹{feeData.total_amount.toLocaleString()}</p>
          <div className="card-footer">
            <span className="card-label">Course Fee Structure</span>
          </div>
        </div>
        <div className="fee-card">
          <div className="card-icon success">
            <FaCheckCircle />
          </div>
          <h3>Amount Paid</h3>
          <p className="fee-amount">₹{feeData.amount_paid.toLocaleString()}</p>
          <div className="card-footer">
            <span className="card-label">Successfully Processed</span>
          </div>
        </div>
        <div className="fee-card">
          <div className="card-icon warning">
            <FaExclamationCircle />
          </div>
          <h3>Amount Due</h3>
          <p className="fee-amount">₹{feeData.due_amount.toLocaleString()}</p>
          <div className="card-footer">
            <span className="card-label">Pending Payment</span>
          </div>
        </div>
        <div className="fee-card">
          <div className="card-icon info">
            <FaCalendarAlt />
          </div>
          <h3>Next Due Date</h3>
          <p className="fee-date">
            {feeData.next_due_date 
              ? new Date(feeData.next_due_date).toLocaleDateString() 
              : 'No upcoming due date'}
          </p>
          <div className="card-footer">
            <span className="card-label">Payment Schedule</span>
          </div>
        </div>
      </div>
      
      <div className="fee-details-section">
        <h2><FaReceipt /> Fee Structure Details</h2>
        <div className="fee-structure-details">
          <p>
            <strong>Structure Name:</strong> 
            <span>{feeData.fee_details?.fee_structure_name || 'N/A'}</span>
          </p>
          <p>
            <strong>Payment Status:</strong> 
            <span className={`status-badge ${feeData.fee_details?.status || 'unknown'}`}>
              {(feeData.fee_details?.status || 'unknown').replace('_', ' ')}
            </span>
          </p>
          <p>
            <strong>Assigned Date:</strong> 
            <span>{feeData.fee_details?.assigned_date ? new Date(feeData.fee_details.assigned_date).toLocaleDateString() : 'N/A'}</span>
          </p>
          <p>
            <strong>Payment Progress:</strong>
            <span>
              {feeData.total_amount > 0 
                ? `${Math.round((feeData.amount_paid / feeData.total_amount) * 100)}% Complete`
                : '0% Complete'
              }
            </span>
          </p>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{
                width: feeData.total_amount > 0 
                  ? `${(feeData.amount_paid / feeData.total_amount) * 100}%` 
                  : '0%'
              }}
            ></div>
          </div>
          <div className="progress-labels">
            <span>₹0</span>
            <span>₹{feeData.total_amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="installments-section">
        <h2><FaClock /> Installment Schedule</h2>
        <div className="table-container">
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
                  const isPaid = installment.is_paid || false;
                  const isOverdue = !isPaid && new Date(installment.due_date) < new Date();
                  
                  return (
                    <tr key={installment.id}>
                      <td>Installment {installment.sequence || index + 1}</td>
                      <td>₹{installment.amount.toLocaleString()}</td>
                      <td>{new Date(installment.due_date).toLocaleDateString()}</td>
                      <td>
                        {isPaid ? (
                          <div>
                            <span className="status-badge paid">✅ Paid</span>
                            {installment.payment_date && (
                              <small style={{display: 'block', color: '#28a745', fontSize: '11px', marginTop: '2px'}}>
                                Paid on: {new Date(installment.payment_date).toLocaleDateString()}
                              </small>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className={`status-badge ${isOverdue ? 'overdue' : 'pending'}`}>
                              {isOverdue ? '⚠️ Overdue' : '⏳ Pending'}
                            </span>
                            <button 
                              className="btn-small btn-primary" 
                              onClick={() => handlePayNow(installment)}
                              style={{marginLeft: '10px', padding: '4px 8px', fontSize: '12px'}}
                            >
                              Pay Now
                            </button>
                          </div>
                        )}
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
      </div>
      
      <div className="payment-history-section">
        <h2><FaReceipt /> Payment History</h2>
        <div className="table-container">
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
                        onClick={() => {
                          setCurrentReceipt({
                            receipt_number: payment.receipt_number,
                            payment_date: payment.payment_date,
                            student_name: feeData.fee_details?.student_name || 'Student',
                            enrollment_id: feeData.fee_details?.enrollment_id || 'N/A',
                            course: feeData.fee_details?.course || 'N/A',
                            amount: payment.amount,
                            payment_mode: payment.payment_mode,
                            transaction_id: payment.transaction_id || 'N/A',
                            status: payment.status
                          });
                          setShowReceiptModal(true);
                        }}
                        title="View Receipt"
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
      </div>
      
      {feeData.due_amount > 0 && (
        <div className="payment-options">
          <h2><FaCreditCard /> Make Payment</h2>
          <p className="payment-description">
            Secure and convenient payment options available. Choose your preferred method below.
          </p>
          <button className="btn-primary" onClick={handlePayNow}>
            <FaShieldAlt /> Pay Securely Now
          </button>
          <div className="payment-features">
            <div className="feature">
              <FaShieldAlt className="feature-icon" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="feature">
              <FaCreditCard className="feature-icon" />
              <span>Multiple Payment Methods</span>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>
      )}
      
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <h2>Make Payment</h2>
            <form onSubmit={handlePaymentSubmit}>
              {availableInstallments.length > 0 && (
                <div className="form-group">
                  <label>Select Installment to Pay</label>
                  <select 
                    value={selectedInstallment ? selectedInstallment.id : ''}
                    onChange={(e) => {
                      const selected = availableInstallments.find(inst => inst.id === parseInt(e.target.value));
                      setSelectedInstallment(selected);
                      setPaymentAmount(selected ? selected.amount : 0);
                    }}
                    required
                  >
                    <option value="">Choose an installment</option>
                    {availableInstallments.map((installment, index) => {
                      const isOverdue = new Date(installment.due_date) < new Date();
                      return (
                        <option key={installment.id} value={installment.id}>
                          Installment {installment.sequence || index + 1} - ₹{installment.amount.toLocaleString()} 
                          (Due: {new Date(installment.due_date).toLocaleDateString()}) 
                          {isOverdue ? ' - OVERDUE' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <p className="helper-text">
                    {availableInstallments.length} unpaid installment(s) available
                  </p>
                </div>
              )}
              
              <div className="form-group">
                <label>Amount to Pay (₹)</label>
                <input 
                  type="number" 
                  value={paymentAmount}
                  readOnly
                  style={{backgroundColor: '#f8f9fa', fontWeight: '600', fontSize: '18px'}}
                />
                {selectedInstallment && (
                  <p className="helper-text">
                    Paying for Installment {selectedInstallment.sequence} 
                    (Due: {new Date(selectedInstallment.due_date).toLocaleDateString()})
                  </p>
                )}
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
                  <div className="payment-info-header">
                    <FaShieldAlt className="security-icon" />
                    <h3>Secure Online Payment</h3>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'bank_transfer' && (
                <div className="bank-details">
                  <div className="bank-details-header">
                    <FaUniversity className="bank-icon" />
                    <h3>Bank Account Details</h3>
                  </div>
                  <div className="bank-info">
                    <div className="bank-detail-item">
                      <strong>Account Name:</strong>
                      <span>ERP Portal</span>
                    </div>
                    <div className="bank-detail-item">
                      <strong>Account Number:</strong>
                      <span>1234567890</span>
                    </div>
                    <div className="bank-detail-item">
                      <strong>IFSC Code:</strong>
                      <span>ABCD0001234</span>
                    </div>
                    <div className="bank-detail-item">
                      <strong>Bank Name:</strong>
                      <span>Example Bank</span>
                    </div>
                  </div>
                  <div className="bank-note">
                    <FaExclamationCircle className="note-icon" />
                    <p>After making the payment, please submit this form. Your payment will be verified by the admin.</p>
                  </div>
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
                  {processingPayment ? (
                    <>
                      <FaClock className="spinning" />
                      Processing...
                    </>
                  ) : paymentMethod === 'razorpay' ? (
                    <>
                      <FaShieldAlt />
                      Pay with Razorpay
                    </>
                  ) : (
                    <>
                      <FaUniversity />
                      Submit Payment Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="notification-popup-overlay">
          <div className="notification-popup">
            <div className="notification-popup-header">
              <h3>📢 Important Notifications</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowNotificationPopup(false)}
              >
                ×
              </button>
            </div>
            <div className="notification-popup-content">
              {notifications.filter(n => n.is_popup && !n.is_read).map(notification => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-icon">
                    {notification.type === 'installment_due' ? '🔔' : '💰'}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.created_at).toLocaleDateString()}</small>
                  </div>
                  <button 
                    className="btn-small btn-secondary"
                    onClick={() => {
                      markNotificationRead(notification.id);
                      if (notifications.filter(n => n.is_popup && !n.is_read).length === 1) {
                        setShowNotificationPopup(false);
                      }
                    }}
                  >
                    Got it
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {showReceiptModal && (
        <ReceiptModal 
          payment={currentReceipt}
          onClose={() => setShowReceiptModal(false)}
          canDownload={true}
        />
      )}
    </div>
  );
};

export default StudentFeeManagement;