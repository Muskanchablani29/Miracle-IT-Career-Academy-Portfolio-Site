import React from 'react';
// import '../../course-container.css';

const Mern = () => {
  return (
    <div className="course-container">
      <h1>MERN Stack Development</h1>
      <p className="course-description">
        Explore our comprehensive MERN Stack curriculum designed to help you master this technology stack.
      </p>
      
      <div className="course-grid">
        <div className="course-card">
          <h3>Introduction to MERN</h3>
          <p>Learn the fundamentals of MongoDB, Express, React, and Node.js and build a strong foundation.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>Advanced MERN Development</h3>
          <p>Take your MERN stack skills to the next level with advanced concepts and state management.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>MERN Projects</h3>
          <p>Apply your knowledge by building real-world projects using the MERN stack.</p>
          <button className="enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

export default Mern;