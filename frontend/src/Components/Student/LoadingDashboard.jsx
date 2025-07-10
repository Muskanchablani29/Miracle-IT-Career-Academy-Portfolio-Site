import React from 'react';
import './LoadingDashboard.css';

const LoadingDashboard = () => {
  return (
    <div className="loading-dashboard">
      <div className="loading-header">
        <div className="loading-welcome">
          <div className="loading-title"></div>
          <div className="loading-subtitle"></div>
        </div>
        <div className="loading-search"></div>
      </div>
      
      <div className="loading-stats-grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="loading-stat-card">
            <div className="loading-stat-icon"></div>
            <div className="loading-stat-content">
              <div className="loading-stat-number"></div>
              <div className="loading-stat-label"></div>
              <div className="loading-stat-trend"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="loading-content-grid">
        <div className="loading-left-column">
          <div className="loading-section">
            <div className="loading-section-header"></div>
            <div className="loading-courses-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="loading-course-card"></div>
              ))}
            </div>
          </div>
          
          <div className="loading-section">
            <div className="loading-section-header"></div>
            <div className="loading-activity-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="loading-activity-item">
                  <div className="loading-activity-icon"></div>
                  <div className="loading-activity-content">
                    <div className="loading-activity-title"></div>
                    <div className="loading-activity-time"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="loading-right-column">
          <div className="loading-section">
            <div className="loading-section-header"></div>
            <div className="loading-quick-actions">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="loading-action-card"></div>
              ))}
            </div>
          </div>
          
          <div className="loading-section">
            <div className="loading-section-header"></div>
            <div className="loading-events-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="loading-event-item">
                  <div className="loading-event-date"></div>
                  <div className="loading-event-content">
                    <div className="loading-event-title"></div>
                    <div className="loading-event-type"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDashboard;