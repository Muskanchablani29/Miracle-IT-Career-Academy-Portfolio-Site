import React from 'react';
import './Footer.css';
import logo from './Images/Logo-miracle.png';

const Footer = ({ className = '' }) => {
  return (
    <footer className={`footer ${className}`}>
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Miracle IT Career Academy" />
            <h3>Miracle IT Career Academy</h3>
          </div>
          <p>Empowering careers through cutting-edge technology education and hands-on training.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>📧 info@miracleitacademy.com</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>📍 123 Tech Street, Innovation City</p>
        </div>
        
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Miracle IT Career Academy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;