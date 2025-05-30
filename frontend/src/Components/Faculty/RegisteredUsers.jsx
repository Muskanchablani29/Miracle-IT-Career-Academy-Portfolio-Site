import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../../api';
import { FaSearch, FaFilter, FaDownload, FaEnvelope } from 'react-icons/fa';
import './RegisteredUsers.css';

const RegisteredUsers = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch workshops for the faculty
        const workshopsResponse = await userAxiosInstance.get('workshops/');
        setWorkshops(workshopsResponse.data);
        
        // Fetch real registrations for faculty's workshops
        // First try faculty-specific endpoint
        try {
          const registrationsResponse = await userAxiosInstance.get('faculty/workshop-registrations/');
          
          // Transform the data if needed to match our component's expected format
          const formattedRegistrations = registrationsResponse.data.map(reg => ({
            id: reg.id,
            user_name: reg.name,
            email: reg.email,
            phone: reg.phone,
            workshop_id: reg.workshop_id,
            workshop_title: reg.workshop_title || 'Workshop',
            registration_date: reg.created_at || new Date().toISOString(),
            status: reg.status || 'pending'
          }));
          
          setRegistrations(formattedRegistrations);
        } catch (facultyErr) {
          // If faculty-specific endpoint fails, fall back to general endpoint
          console.log('Falling back to general workshop registrations endpoint');
          const registrationsResponse = await userAxiosInstance.get('workshop-registrations/');
          
          // Transform the data if needed to match our component's expected format
          const formattedRegistrations = registrationsResponse.data.map(reg => ({
            id: reg.id,
            user_name: reg.name,
            email: reg.email,
            phone: reg.phone,
            workshop_id: reg.workshop_id,
            workshop_title: reg.workshop_title || 'Workshop',
            registration_date: reg.created_at || new Date().toISOString(),
            status: reg.status || 'pending'
          }));
          
          setRegistrations(formattedRegistrations);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load registration data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleWorkshopChange = (e) => {
    setSelectedWorkshop(e.target.value);
  };

  const exportToCSV = () => {
    const filteredData = getFilteredRegistrations();
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Workshop', 'Registration Date', 'Status'],
      ...filteredData.map(reg => [
        reg.user_name,
        reg.email,
        reg.phone,
        reg.workshop_title,
        new Date(reg.registration_date).toLocaleDateString(),
        reg.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'workshop_registrations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredRegistrations = () => {
    return registrations.filter(reg => {
      const matchesSearch = 
        reg.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.workshop_title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' || 
        reg.status.toLowerCase() === filter.toLowerCase();
      
      const matchesWorkshop = 
        selectedWorkshop === 'all' || 
        reg.workshop_id.toString() === selectedWorkshop;
      
      return matchesSearch && matchesFilter && matchesWorkshop;
    });
  };

  const sendEmailToAll = () => {
    alert('Email functionality would be implemented here');
  };

  if (loading) {
    return <div className="loading">Loading registration data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const filteredRegistrations = getFilteredRegistrations();

  return (
    <div className="registered-users-container">
      <div className="page-header">
        <h1>Workshop Registrations</h1>
        <div className="action-buttons">
          <button className="export-btn" onClick={exportToCSV}>
            <FaDownload /> Export to CSV
          </button>
          <button className="email-btn" onClick={sendEmailToAll}>
            <FaEnvelope /> Email All
          </button>
        </div>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email or workshop..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter">
            <FaFilter className="filter-icon" />
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="attended">Attended</option>
            </select>
          </div>
          
          <div className="filter">
            <select value={selectedWorkshop} onChange={handleWorkshopChange}>
              <option value="all">All Workshops</option>
              {workshops.map(workshop => (
                <option key={workshop.id} value={workshop.id.toString()}>
                  {workshop.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="registrations-stats">
        <div className="stat-card">
          <h3>{registrations.length}</h3>
          <p>Total Registrations</p>
        </div>
        <div className="stat-card">
          <h3>{registrations.filter(reg => reg.status === 'confirmed').length}</h3>
          <p>Confirmed</p>
        </div>
        <div className="stat-card">
          <h3>{registrations.filter(reg => reg.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{registrations.filter(reg => reg.status === 'attended').length}</h3>
          <p>Attended</p>
        </div>
      </div>

      <div className="registrations-table-container">
        <table className="registrations-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Workshop</th>
              <th>Registration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map(registration => (
                <tr key={registration.id}>
                  <td>{registration.user_name}</td>
                  <td>{registration.email}</td>
                  <td>{registration.phone}</td>
                  <td>{registration.workshop_title}</td>
                  <td>{new Date(registration.registration_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${registration.status.toLowerCase()}`}>
                      {registration.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button className="view-btn">View</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No registrations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredUsers;