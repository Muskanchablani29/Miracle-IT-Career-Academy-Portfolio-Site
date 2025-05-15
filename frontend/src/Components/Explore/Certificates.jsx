import React from 'react';
import './components.css';

const Certificates = () => {
  return (
    <div className="certificates-container">
      <h2>Earn a Certificate</h2>
      <p>Complete these courses to earn valuable certificates that boost your resume.</p>
      
      <div className="certificates-list">
        {certificatePrograms.map((program) => (
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
        ))}
      </div>
    </div>
  );
};

// Sample certificate programs data
const certificatePrograms = [
  {
    id: 1,
    title: "Full Stack Web Development",
    description: "Comprehensive program covering front-end and back-end development",
    image: "https://via.placeholder.com/300x200",
    duration: "6 months",
    level: "Intermediate to Advanced"
  },
  {
    id: 2,
    title: "Data Science Certification",
    description: "Master data analysis, visualization, and machine learning",
    image: "https://via.placeholder.com/300x200",
    duration: "4 months",
    level: "Intermediate"
  },
  {
    id: 3,
    title: "Cloud Computing Specialist",
    description: "Learn AWS, Azure, and Google Cloud platforms",
    image: "https://via.placeholder.com/300x200",
    duration: "3 months",
    level: "Intermediate"
  }
];

export default Certificates;