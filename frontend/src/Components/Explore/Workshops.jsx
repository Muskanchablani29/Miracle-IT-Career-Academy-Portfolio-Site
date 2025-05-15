import React from 'react';
import './components.css';

const Workshops = () => {
  return (
    <div className="workshops-container">
      <h2>Attend a Workshop</h2>
      <p>Join our interactive workshops to gain hands-on experience and network with professionals.</p>
      
      <div className="workshops-list">
        {workshopsList.map((workshop) => (
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
                  <strong>Available Seats:</strong> {workshop.availableSeats}
                </div>
              </div>
              <button className="register-btn">Register Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sample workshops data
const workshopsList = [
  {
    id: 1,
    title: "UI/UX Design Workshop",
    description: "Learn the principles of user-centered design and create stunning interfaces",
    image: "https://via.placeholder.com/300x200",
    date: "June 15, 2023",
    location: "Online",
    availableSeats: 25
  },
  {
    id: 2,
    title: "DevOps Practices Workshop",
    description: "Implement CI/CD pipelines and automate your development workflow",
    image: "https://via.placeholder.com/300x200",
    date: "July 5, 2023",
    location: "Tech Hub, Building 3",
    availableSeats: 15
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications using React Native",
    image: "https://via.placeholder.com/300x200",
    date: "July 20, 2023",
    location: "Online",
    availableSeats: 30
  }
];

export default Workshops;