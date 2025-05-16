import React from 'react'
import './ArtificialIntelligence.css'

export default function ArtificialInteligence() {
  return (
    <div className="ai-container">
      <h1>Artificial Intelligence</h1>
      <p className="course-description">
        Explore our comprehensive Artificial Intelligence curriculum designed to take you from basics to advanced concepts.
      </p>
      
      <div className="course-grid">
        <div className="course-card">
          <h3>Introduction to AI</h3>
          <p>Learn the fundamentals of artificial intelligence and its applications.</p>
          <button className="enroll-button">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>Natural Language Processing</h3>
          <p>Master NLP techniques and build intelligent language processing systems.</p>
          <button className="enroll-button">Enroll Now</button>
        </div>
        
        <div className="course-card">
          <h3>Computer Vision</h3>
          <p>Explore image recognition and visual data processing with AI.</p>
          <button className="enroll-button">Enroll Now</button>
        </div>
      </div>
    </div>
  )
}