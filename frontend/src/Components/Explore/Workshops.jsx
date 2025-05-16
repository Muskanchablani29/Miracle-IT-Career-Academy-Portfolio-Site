import React, { useState, useEffect } from 'react';
import './components.css';
import { fetchWorkshops } from '../../api';

const Workshops = () => {
  const [workshopsList, setWorkshopsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWorkshops = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkshops();
        setWorkshopsList(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load workshops. Please try again later.');
        setLoading(false);
        console.error('Error fetching workshops:', err);
      }
    };

    getWorkshops();
  }, []);

  if (loading) {
    return <div className="loading">Loading workshops...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workshops-container">
      <h2>Attend a Workshop</h2>
      <p>Join our interactive workshops to gain hands-on experience and network with professionals.</p>
      
      <div className="workshops-list">
        {workshopsList.length > 0 ? (
          workshopsList.map((workshop) => (
            <div className="workshop-card" key={workshop.id}>
              <div className="workshop-image">
                <img src={workshop.image} alt={workshop.title} />
              </div>
              <div className="workshop-details">
                <h3>{workshop.title}</h3>
                <p>{workshop.description}</p>
                <div className="workshop-meta">
                  <div className="workshop-date">
                    <strong>Date:</strong> {workshop.date}
                  </div>
                  <div className="workshop-location">
                    <strong>Location:</strong> {workshop.location}
                  </div>
                  <div className="workshop-seats">
                    <strong>Available Seats:</strong> {workshop.available_seats}
                  </div>
                </div>
                <button className="register-btn">Register Now</button>
              </div>
            </div>
          ))
        ) : (
          <p>No workshops available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Workshops;