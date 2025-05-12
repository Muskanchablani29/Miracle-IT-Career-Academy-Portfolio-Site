import React, { useEffect, useRef } from 'react';
import './Hometwo.css';
import boyImg from '../Images/Laptop.png';

const MiraclePage = () => {
  const welcomeRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    // Add animation classes after component mounts for entrance animations
    const timer1 = setTimeout(() => {
      if (welcomeRef.current) welcomeRef.current.classList.add('animate-in');
    }, 100);
    
    const timer2 = setTimeout(() => {
      if (headingRef.current) headingRef.current.classList.add('animate-in');
    }, 300);
    
    const timer3 = setTimeout(() => {
      if (subheadingRef.current) subheadingRef.current.classList.add('animate-in');
    }, 500);
    
    const timer4 = setTimeout(() => {
      if (textRef.current) textRef.current.classList.add('animate-in');
    }, 700);
    
    const timer5 = setTimeout(() => {
      if (buttonRef.current) buttonRef.current.classList.add('animate-in');
    }, 900);
    
    const timer6 = setTimeout(() => {
      if (animationRef.current) animationRef.current.classList.add('animate-in');
    }, 1100);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, []);

  return (
    <div className="miracle-container">
      {/* Animated background elements */}
      <div className="bg-element bg-element-1"></div>
      <div className="bg-element bg-element-2"></div>
      <div className="bg-element bg-element-3"></div>
      <div className="bg-element bg-element-4"></div>
      
      {/* Left side welcome section */}
      <div className="welcome-section" ref={welcomeRef}>
        <div className="content-wrapper">
          <h1 className="heading" ref={headingRef}>
            <span className="highlight">Miracle</span> IT Career Academy
          </h1>
          <h2 className="subheading" ref={subheadingRef}>Empowering Your Tech Journey</h2>
          <p className="welcome-text" ref={textRef}>
            Join our premier coaching institute and unlock your potential in the IT industry. 
            We offer comprehensive training programs designed to transform beginners into 
            industry-ready professionals with hands-on experience and expert guidance.
          </p>
          <div className="button-container" ref={buttonRef}>
            <button className="cta-button">
              <span>Explore Courses</span>
              <svg className="button-arrow" viewBox="0 0 24 24" width="24" height="24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Top left rings animation */}
        <div className="rings-animation top-left">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
          <div className="ring ring-4"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="tech-pattern tech-pattern-1"></div>
        <div className="tech-pattern tech-pattern-2"></div>
      </div>
      
      {/* Right side animation section */}
      <div className="animation-section" ref={animationRef}>
        <div className="main-circle"></div>
        
        {/* Underscore rings instead of dotted ring */}
        <div className="underscore-ring outer-ring"></div>
        <div className="underscore-ring middle-ring"></div>
        <div className="underscore-ring inner-ring"></div>
        <div className="underscore-ring extra-ring"></div>
        
        <div className="glow-effect"></div>
        <img src={boyImg} alt="Student with Laptop" className="boy-img" />
        
        {/* Feature cards positioned around the circle */}
        <div className="feature-card card-1">
          <div className="card-icon-wrapper">
            <span className="card-icon">📚</span>
          </div>
          <div className="card-content">
            <h3 className="card-title">50+ Courses</h3>
            <p className="card-desc">Comprehensive curriculum</p>
          </div>
        </div>
        
        <div className="feature-card card-2">
          <div className="card-icon-wrapper">
            <span className="card-icon">💰</span>
          </div>
          <div className="card-content">
            <h3 className="card-title">Limited Fee</h3>
            <p className="card-desc">Affordable education</p>
          </div>
        </div>
        
        <div className="feature-card card-3">
          <div className="card-icon-wrapper">
            <span className="card-icon">🌐</span>
          </div>
          <div className="card-content">
            <h3 className="card-title">Online Lectures</h3>
            <p className="card-desc">Learn from anywhere</p>
          </div>
        </div>
        
        <div className="feature-card card-4">
          <div className="card-icon-wrapper">
            <span className="card-icon">🖥️</span>
          </div>
          <div className="card-content">
            <h3 className="card-title">IT Training</h3>
            <p className="card-desc">Industry-ready skills</p>
          </div>
        </div>
        
        {/* Bottom right rings animation */}
        <div className="rings-animation bottom-right">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
          <div className="ring ring-4"></div>
        </div>
        
        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(15)].map((_, index) => (
            <div key={index} className={`particle particle-${index + 1}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiraclePage;