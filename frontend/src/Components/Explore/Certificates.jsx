import React, { useState, useEffect } from 'react';
import './components.css';
import { fetchCertificates } from '../../api';

const Certificates = () => {
  const [certificatePrograms, setCertificatePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCertificates = async () => {
      try {
        setLoading(true);
        const data = await fetchCertificates();
        setCertificatePrograms(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load certificates. Please try again later.');
        setLoading(false);
        console.error('Error fetching certificates:', err);
      }
    };

    getCertificates();
  }, []);

  if (loading) {
    return <div className="loading">Loading certificates...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="certificates-container">
      <h2>Earn a Certificate</h2>
      <p>Complete these courses to earn valuable certificates that boost your resume.</p>
      
      <div className="certificates-list">
        {certificatePrograms.length > 0 ? (
          certificatePrograms.map((program) => (
            <div className="certificate-card" key={program.id}>
              <div className="certificate-image">
                <img src={program.image} alt={program.title} />
              </div>
              <div className="certificate-details">
                <h3>{program.title}</h3>
                <p>{program.description}</p>
                <div className="certificate-meta">
                  <span>{program.duration}</span>
                  <span>{program.level}</span>
                </div>
                <button className="enroll-btn">Start Program</button>
              </div>
            </div>
          ))
        ) : (
          <p>No certificate programs available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Certificates;