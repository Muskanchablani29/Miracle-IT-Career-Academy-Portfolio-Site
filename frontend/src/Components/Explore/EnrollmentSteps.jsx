import React from 'react';
import './EnrollmentSteps.css';

const EnrollmentSteps = () => {
  return (
    <div className="enrollment-container">
      <h2>How to Get Started</h2>
      <div className="enrollment-content">
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Choose Your Course</h3>
              <p>Browse our catalog and select a course that matches your career goals and interests.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Enroll Online</h3>
              <p>Complete the simple enrollment process and gain immediate access to course materials.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Start Learning</h3>
              <p>Begin your learning journey with expert-led lessons, projects, and personalized support.</p>
            </div>
          </div>
        </div>
        <div className="animation-container">
          <div className="enrollment-animation">
            <div className="animation-circle">
              <div className="animation-icon search-icon"></div>
            </div>
            <div className="animation-circle">
              <div className="animation-icon enroll-icon"></div>
            </div>
            <div className="animation-circle">
              <div className="animation-icon learn-icon"></div>
            </div>
            <div className="animation-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSteps;