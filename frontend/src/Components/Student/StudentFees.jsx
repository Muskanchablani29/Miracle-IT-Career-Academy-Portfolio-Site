import React from 'react';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaCalendarAlt,
  FaReceipt,
  FaCreditCard,
  FaShieldAlt
} from 'react-icons/fa';
import './StudentFeeManagement.css';

const StudentFees = () => {
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <h1><FaMoneyBillWave /> Fee Management</h1>
          <p className="page-subtitle">View and manage your fee payments with ease</p>
        </div>
      </div>
      
      <div className="fee-summary">
        <div className="fee-card">
          <div className="card-icon">
            <FaChartLine />
          </div>
          <h3>Total Fees</h3>
          <p className="fee-amount">₹45,000</p>
          <div className="card-footer">
            <span className="card-label">Course Fee Structure</span>
          </div>
        </div>
        
        <div className="fee-card">
          <div className="card-icon success">
            <FaCheckCircle />
          </div>
          <h3>Amount Paid</h3>
          <p className="fee-amount">₹30,000</p>
          <div className="card-footer">
            <span className="card-label">Successfully Processed</span>
          </div>
        </div>
        
        <div className="fee-card">
          <div className="card-icon warning">
            <FaExclamationCircle />
          </div>
          <h3>Amount Due</h3>
          <p className="fee-amount">₹15,000</p>
          <div className="card-footer">
            <span className="card-label">Pending Payment</span>
          </div>
        </div>
        
        <div className="fee-card">
          <div className="card-icon info">
            <FaCalendarAlt />
          </div>
          <h3>Next Due Date</h3>
          <p className="fee-date">15 Aug, 2024</p>
          <div className="card-footer">
            <span className="card-label">Payment Schedule</span>
          </div>
        </div>
      </div>
      
      <div className="payment-history-section">
        <h2><FaReceipt /> Payment History</h2>
        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Receipt No.</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10 Jan, 2024</td>
              <td>REC-001</td>
              <td>₹15,000</td>
              <td>Online</td>
              <td><span className="status-badge paid">Paid</span></td>
            </tr>
            <tr>
              <td>15 Apr, 2024</td>
              <td>REC-002</td>
              <td>₹15,000</td>
              <td>Online</td>
              <td><span className="status-badge paid">Paid</span></td>
            </tr>
            <tr>
              <td>15 Aug, 2024</td>
              <td>REC-003</td>
              <td>₹15,000</td>
              <td>-</td>
              <td><span className="status-badge pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="payment-options">
        <h2><FaCreditCard /> Make Payment</h2>
        <p className="payment-description">
          Secure and convenient payment options available. Choose your preferred method below.
        </p>
        <button className="btn-primary">
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
    </div>
  );
};

export default StudentFees;