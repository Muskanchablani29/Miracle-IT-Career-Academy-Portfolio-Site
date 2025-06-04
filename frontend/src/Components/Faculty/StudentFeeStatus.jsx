import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaMoneyBillWave, FaExclamationTriangle, FaSearch, FaFilter } from 'react-icons/fa';
import './FacultyDashboard.css';

const StudentFeeStatus = () => {
  const { batchId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(batchId || '');

  // Mock data for development
  const mockBatches = [
    { id: 1, name: 'Batch 2023-A' },
    { id: 2, name: 'Batch 2023-B' },
    { id: 3, name: 'Batch 2023-C' }
  ];
  
  const mockStudents = [
    { student_id: 1, student_name: 'John Smith', enrollment_id: 'ENRL2301', total_amount: 45000, amount_paid: 30000, status: 'partially_paid', last_payment_date: '2023-07-15' },
    { student_id: 2, student_name: 'Priya Sharma', enrollment_id: 'ENRL2302', total_amount: 50000, amount_paid: 50000, status: 'paid', last_payment_date: '2023-07-10' },
    { student_id: 3, student_name: 'Rajesh Kumar', enrollment_id: 'ENRL2303', total_amount: 35000, amount_paid: 0, status: 'unpaid', last_payment_date: null },
    { student_id: 4, student_name: 'Anita Desai', enrollment_id: 'ENRL2304', total_amount: 45000, amount_paid: 15000, status: 'partially_paid', last_payment_date: '2023-06-20' },
    { student_id: 5, student_name: 'Vikram Singh', enrollment_id: 'ENRL2305', total_amount: 35000, amount_paid: 35000, status: 'paid', last_payment_date: '2023-07-05' }
  ];

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get('/api/batches/');
        setBatches(response.data);
      } catch (err) {
        console.error('Error fetching batches:', err);
        // Use mock data if API call fails
        setBatches(mockBatches);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchStudentFees = async () => {
      try {
        setLoading(true);
        
        try {
          const response = await axios.get(`/api/faculty-student-fees/?batch_id=${selectedBatch || ''}`);
          setStudents(response.data);
        } catch (err) {
          console.error('Error fetching student fee data:', err);
          // Use mock data if API call fails
          setStudents(mockStudents);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchStudentFees:', err);
        setError('Failed to load student fee data. Please try again later.');
        setLoading(false);
      }
    };

    if (selectedBatch || batchId) {
      fetchStudentFees();
    } else if (batches.length > 0) {
      setSelectedBatch(batches[0].id);
    }
  }, [selectedBatch, batchId, batches]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.enrollment_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  if (loading) {
    return <div className="loading">Loading student fee data...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <FaExclamationTriangle />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1><FaMoneyBillWave /> Student Fee Status</h1>
      
      <div className="filters-container">
        <div className="batch-selector">
          <label>Select Batch:</label>
          <select 
            value={selectedBatch} 
            onChange={handleBatchChange}
          >
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or enrollment ID" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>
      
      <div className="fee-summary-cards">
        <div className="summary-card">
          <h3>Total Students</h3>
          <p className="summary-number">{students.length}</p>
        </div>
        <div className="summary-card">
          <h3>Fully Paid</h3>
          <p className="summary-number">
            {students.filter(student => student.status === 'paid').length}
          </p>
        </div>
        <div className="summary-card">
          <h3>Partially Paid</h3>
          <p className="summary-number">
            {students.filter(student => student.status === 'partially_paid').length}
          </p>
        </div>
        <div className="summary-card">
          <h3>Unpaid</h3>
          <p className="summary-number">
            {students.filter(student => student.status === 'unpaid').length}
          </p>
        </div>
      </div>
      
      <div className="fee-table-container">
        <table className="fee-table">
          <thead>
            <tr>
              <th>Enrollment ID</th>
              <th>Student Name</th>
              <th>Total Amount</th>
              <th>Amount Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Last Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.enrollment_id}</td>
                  <td>{student.student_name}</td>
                  <td>₹{student.total_amount.toLocaleString()}</td>
                  <td>₹{student.amount_paid.toLocaleString()}</td>
                  <td>₹{(student.total_amount - student.amount_paid).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                      {student.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{student.last_payment_date ? new Date(student.last_payment_date).toLocaleDateString() : 'No payment'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  <FaExclamationTriangle />
                  <p>No students found matching the filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFeeStatus;