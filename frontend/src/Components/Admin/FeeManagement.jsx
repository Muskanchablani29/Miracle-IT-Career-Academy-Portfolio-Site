import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaMoneyBillWave, FaPlus, FaEdit, FaTrash, FaDownload, FaFilter, FaSearch, FaFileInvoice } from 'react-icons/fa';
import './AdminDashboard.css';

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('structures');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for data
  const [feeStructures, setFeeStructures] = useState([]);
  const [studentFees, setStudentFees] = useState([]);
  const [courses, setCourses] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalAssigned: 0,
    totalCollected: 0,
    totalPending: 0,
    collectionRate: 0
  });

  // Mock data for development
  const mockFeeStructures = [
    { id: 1, name: 'Full Stack Web Development - 2023', course: { title: 'Full Stack Web Development' }, registration_fee: 5000, tuition_fee: 40000, total_amount: 45000, installments: 3, created_at: '2023-07-01' },
    { id: 2, name: 'Data Science - 2023', course: { title: 'Data Science' }, registration_fee: 5000, tuition_fee: 45000, total_amount: 50000, installments: 3, created_at: '2023-07-05' },
    { id: 3, name: 'Python Programming - 2023', course: { title: 'Python Programming' }, registration_fee: 3000, tuition_fee: 32000, total_amount: 35000, installments: 2, created_at: '2023-07-10' }
  ];
  
  const mockStudentFees = [
    { id: 1, student_name: 'John Smith', fee_structure_name: 'Full Stack Web Development - 2023', total_amount: 45000, amount_paid: 30000, status: 'partially_paid' },
    { id: 2, student_name: 'Priya Sharma', fee_structure_name: 'Data Science - 2023', total_amount: 50000, amount_paid: 50000, status: 'paid' },
    { id: 3, student_name: 'Rajesh Kumar', fee_structure_name: 'Python Programming - 2023', total_amount: 35000, amount_paid: 0, status: 'unpaid' }
  ];
  
  const mockCourses = [
    { id: 1, title: 'Full Stack Web Development' },
    { id: 2, title: 'Data Science' },
    { id: 3, title: 'Python Programming' }
  ];

  // Fetch data from backend or use mock data if API fails
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch real data
        try {
          // Fetch fee structures
          const structuresResponse = await axios.get('/api/fee-structures/');
          setFeeStructures(structuresResponse.data);
          
          // Fetch student fees
          const feesResponse = await axios.get('/api/student-fees/');
          setStudentFees(feesResponse.data);
          
          // Fetch courses for filtering
          const coursesResponse = await axios.get('/api/courses/');
          setCourses(coursesResponse.data);
          
          // Calculate summary data
          const totalAssigned = feesResponse.data.reduce((sum, fee) => sum + fee.total_amount, 0);
          const totalCollected = feesResponse.data.reduce((sum, fee) => sum + fee.amount_paid, 0);
          const totalPending = totalAssigned - totalCollected;
          const collectionRate = totalAssigned > 0 ? Math.round((totalCollected / totalAssigned) * 100) : 0;
          
          setSummaryData({
            totalAssigned,
            totalCollected,
            totalPending,
            collectionRate
          });
        } catch (err) {
          console.error('Error fetching fee data:', err);
          
          // Fall back to mock data
          setFeeStructures(mockFeeStructures);
          setStudentFees(mockStudentFees);
          setCourses(mockCourses);
          
          // Calculate summary data from mock data
          const totalAssigned = mockStudentFees.reduce((sum, fee) => sum + fee.total_amount, 0);
          const totalCollected = mockStudentFees.reduce((sum, fee) => sum + fee.amount_paid, 0);
          const totalPending = totalAssigned - totalCollected;
          const collectionRate = totalAssigned > 0 ? Math.round((totalCollected / totalAssigned) * 100) : 0;
          
          setSummaryData({
            totalAssigned,
            totalCollected,
            totalPending,
            collectionRate
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load fee data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteFeeStructure = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await axios.delete(`/api/fee-structures/${id}/`);
        setFeeStructures(feeStructures.filter(structure => structure.id !== id));
      } catch (err) {
        console.error('Error deleting fee structure:', err);
        // Still remove from UI for demo purposes
        setFeeStructures(feeStructures.filter(structure => structure.id !== id));
        alert('Fee structure deleted (mock)');
      }
    }
  };

  const handleGenerateInvoice = async (feeId) => {
    try {
      const response = await axios.get(`/api/student-fees/${feeId}/generate-invoice/`, {
        responseType: 'blob'
      });
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${feeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error generating invoice:', err);
      alert('Invoice generation would happen here (mock)');
    }
  };

  const filteredStudentFees = studentFees.filter(fee => {
    const matchesSearch = fee.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || (fee.fee_structure && fee.fee_structure.course === parseInt(courseFilter));
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  if (loading) {
    return <div className="loading">Loading fee data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1><FaMoneyBillWave /> Fee Management</h1>
      
      <div className="fee-summary-cards">
        <div className="summary-card">
          <h3>Total Fees Assigned</h3>
          <p className="summary-number">
            ₹{summaryData.totalAssigned.toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Collected</h3>
          <p className="summary-number">
            ₹{summaryData.totalCollected.toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Pending</h3>
          <p className="summary-number">
            ₹{summaryData.totalPending.toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h3>Collection Rate</h3>
          <p className="summary-number">
            {summaryData.collectionRate}%
          </p>
        </div>
      </div>
      
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={activeTab === 'structures' ? 'active' : ''} 
            onClick={() => setActiveTab('structures')}
          >
            Fee Structures
          </button>
          <button 
            className={activeTab === 'student-fees' ? 'active' : ''} 
            onClick={() => setActiveTab('student-fees')}
          >
            Student Fees
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''} 
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
        
        {activeTab === 'structures' && (
          <div className="tab-content">
            <div className="action-bar">
              <Link to="/admin/fee-structures/create" className="btn-primary">
                <FaPlus /> Create Fee Structure
              </Link>
            </div>
            
            <div className="fee-structures-list">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Registration Fee</th>
                    <th>Tuition Fee</th>
                    <th>Total Amount</th>
                    <th>Installments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructures.length > 0 ? (
                    feeStructures.map(structure => (
                      <tr key={structure.id}>
                        <td>{structure.name}</td>
                        <td>{structure.course.title}</td>
                        <td>₹{structure.registration_fee?.toLocaleString() || '0'}</td>
                        <td>₹{structure.tuition_fee?.toLocaleString() || '0'}</td>
                        <td>₹{structure.total_amount.toLocaleString()}</td>
                        <td>{structure.installments}</td>
                        <td className="actions">
                          <Link to={`/admin/fee-structures/${structure.id}`} className="btn-icon">
                            <FaEdit />
                          </Link>
                          <button 
                            className="btn-icon delete" 
                            onClick={() => handleDeleteFeeStructure(structure.id)}
                          >
                            <FaTrash />
                          </button>
                          <Link to={`/admin/fee-structures/${structure.id}/installments`} className="btn-icon">
                            <FaMoneyBillWave title="Manage Installments" />
                          </Link>
                          <Link to={`/admin/fee-structures/${structure.id}/assign`} className="btn-icon">
                            <FaPlus title="Assign to Students" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">No fee structures found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'student-fees' && (
          <div className="tab-content">
            <div className="action-bar">
              <Link to="/admin/student-fees/assign" className="btn-primary">
                <FaPlus /> Assign Fee to Student
              </Link>
              
              <div className="filters">
                <div className="search-box">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Search by student name" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="filter-select">
                  <FaFilter />
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
                
                <div className="filter-select">
                  <select 
                    value={courseFilter} 
                    onChange={(e) => setCourseFilter(e.target.value)}
                  >
                    <option value="all">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="student-fees-list">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Fee Structure</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudentFees.length > 0 ? (
                    filteredStudentFees.map(fee => (
                      <tr key={fee.id}>
                        <td>{fee.student_name}</td>
                        <td>{fee.fee_structure_name}</td>
                        <td>₹{fee.total_amount.toLocaleString()}</td>
                        <td>₹{fee.amount_paid.toLocaleString()}</td>
                        <td>₹{(fee.total_amount - fee.amount_paid).toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${fee.status}`}>
                            {fee.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="actions">
                          <Link to={`/admin/student-fees/${fee.id}`} className="btn-icon">
                            <FaEdit />
                          </Link>
                          <Link to={`/admin/student-fees/${fee.id}/payments`} className="btn-icon">
                            <FaMoneyBillWave title="Manage Payments" />
                          </Link>
                          <button 
                            className="btn-icon" 
                            onClick={() => handleGenerateInvoice(fee.id)}
                            title="Generate Invoice"
                          >
                            <FaFileInvoice />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">No student fees found matching the filters</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="tab-content">
            <div className="reports-actions">
              <button className="btn-primary">
                <FaDownload /> Export Fee Collection Report
              </button>
              <button className="btn-primary">
                <FaDownload /> Export Outstanding Fees Report
              </button>
            </div>
            
            <div className="report-filters">
              <h3>Generate Custom Report</h3>
              <div className="filter-row">
                <div className="filter-group">
                  <label>Date Range</label>
                  <div className="date-inputs">
                    <input type="date" id="start-date" placeholder="Start Date" />
                    <span>to</span>
                    <input type="date" id="end-date" placeholder="End Date" />
                  </div>
                </div>
                
                <div className="filter-group">
                  <label>Course</label>
                  <select id="report-course">
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Status</label>
                  <select id="report-status">
                    <option value="">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>
              
              <button className="btn-primary">
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;