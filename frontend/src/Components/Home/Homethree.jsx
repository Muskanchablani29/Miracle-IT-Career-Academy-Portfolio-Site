import React, { useMemo, memo, useEffect } from 'react';
import './Homethree.css';
import { motion } from 'framer-motion';

// Features data with enhanced descriptions and custom icons
const features = [
  { 
    title: 'Attendance Tracking', 
    icon: '📊', 
    description: 'Real-time attendance insights with instant notifications for students and parents.',
    color: '#FF6B00'
  },
  { 
    title: 'Course Videos', 
    icon: '🎬', 
    description: 'HD quality course videos with downloadable options for offline learning.',
    color: '#FF7A00'
  },
  { 
    title: 'Performance Analysis', 
    icon: '📈', 
    description: 'AI-powered analytics to track progress and identify improvement areas.',
    color: '#FF8A00'
  },
  { 
    title: 'Certificates', 
    icon: '🏆', 
    description: 'Industry-recognized certificates with blockchain verification technology.',
    color: '#FF9A00'
  },
  { 
    title: 'Fees Tracking', 
    icon: '💰', 
    description: 'Transparent fee structure with multiple payment options and installments.',
    color: '#FFAA00'
  },
  { 
    title: 'AI Assistant', 
    icon: '🤖', 
    description: 'Personalized AI learning assistant available 24/7 to answer your questions.',
    color: '#FFB700'
  },
  { 
    title: 'Flexible Learning', 
    icon: '🕒', 
    description: 'Learn at your own pace with flexible schedules and customizable modules.',
    color: '#FFC300'
  },
  { 
    title: 'Verified Mentors', 
    icon: '👨‍🏫', 
    description: 'Learn from industry experts with years of practical experience.',
    color: '#FFD000'
  },
  { 
    title: '5000+ Trained', 
    icon: '👥', 
    description: 'Join our community of over 5000 successful graduates worldwide.',
    color: '#FFDD00'
  },
  { 
    title: 'Student Testimonials', 
    icon: '⭐', 
    description: 'Hear success stories from our alumni working at top companies globally.',
    color: '#FFEA00'
  },
];

// Animation variants for better performance and reusability
const headerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Enhanced feature card component
const FeatureCard = memo(({ feature, index, totalFeatures }) => {
  // Calculate position for circular arrangement
  const position = useMemo(() => {
    const angle = (360 / totalFeatures) * index;
    const radius = 320; // Radius for the circle
    return {
      x: radius * Math.cos((angle * Math.PI) / 180),
      y: radius * Math.sin((angle * Math.PI) / 180)
    };
  }, [index, totalFeatures]);

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        x: position.x, 
        y: position.y, 
        scale: 1,
        transition: {
          delay: index * 0.15,
          duration: 0.7,
          ease: "easeOut"
        }
      }}
      className="why-card"
      whileHover={{ 
        scale: 1.1,
        boxShadow: `0 20px 40px rgba(255, 107, 0, 0.3)`,
        transition: { duration: 0.3 }
      }}
    >
      <div className="why-icon">{feature.icon}</div>
      <h2 className="why-card-title">{feature.title}</h2>
      <p className="why-card-description">{feature.description}</p>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

// Main component with enhanced animations
export default function WhyChooseUsPage() {
  // Total features count is memoized to avoid recalculation
  const totalFeatures = useMemo(() => features.length, []);
  
  // Add scroll animation effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="why-container">
      <div className="why-circle-container">
        <motion.div 
          className="why-center-box"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="why-title">
            Why Choose <span style={{ color: '#FF9A00' }}>Us</span>
          </h1>
          <p className="why-subtitle">
            Empowering Your Future with <strong style={{ color: '#FF6B00' }}>Smarter Learning</strong> Solutions
          </p>
          
          <div className="why-stats">
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </motion.div>

        <div className="why-features-circle">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index}
              totalFeatures={totalFeatures}
            />
          ))}
        </div>
      </div>
    </div>
  );
}