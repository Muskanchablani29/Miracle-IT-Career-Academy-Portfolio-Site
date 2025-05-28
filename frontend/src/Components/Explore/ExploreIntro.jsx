import React, { useEffect, useState } from 'react';
import './ExploreIntro.css';
import { motion } from 'framer-motion';

const ExploreIntro = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="explore-intro">
      <div className="animated-bg"></div>
      <div className="intro-content">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="intro-title"
        >
          Discover Your Path to Success
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="intro-description"
        >
          Explore our comprehensive range of courses designed to help you master
          in-demand skills and advance your career.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="feature-highlights"
        >
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <div className="feature-text">Web Development</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🤖</div>
            <div className="feature-text">AI & Machine Learning</div>
          </div>
          <div className="feature">
            <div className="feature-icon">📱</div>
            <div className="feature-text">Mobile Development</div>
          </div>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="explore-button"
        >
          Browse Courses
        </motion.button>
      </div>
    </div>
  );
};

export default ExploreIntro;