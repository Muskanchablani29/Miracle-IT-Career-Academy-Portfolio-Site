import React, { useRef, createRef } from 'react';
import { Link } from 'react-router-dom';
import './CourseCategories.css';

const CourseCategories = ({ courses }) => {
  // Group courses by category
  const groupedCourses = courses.reduce((acc, course) => {
    const category = course.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});

  // Define category display names and order
  const categoryDisplayNames = {
    'development': 'Web Development',
    'ai_ml': 'AI & Machine Learning',
    'cloud': 'Cloud Computing',
    'data_science': 'Data Science',
    'basic_computer': 'Basic Computer Skills',
    'job_linked': 'Job-Linked Programs',
    'Uncategorized': 'Other Courses'
  };

  // Sort categories by priority
  const sortedCategories = Object.keys(groupedCourses).sort((a, b) => {
    const orderA = Object.keys(categoryDisplayNames).indexOf(a);
    const orderB = Object.keys(categoryDisplayNames).indexOf(b);
    return orderA - orderB;
  });

  // Create refs for each category
  const categoryRefs = sortedCategories.reduce((acc, category) => {
    acc[category] = createRef();
    return acc;
  }, {});

  // Scroll functions
  const scroll = (category, direction) => {
    if (categoryRefs[category].current) {
      categoryRefs[category].current.scrollBy({
        left: direction * 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="course-categories">
      <h2>Explore Our Courses</h2>
      
      {sortedCategories.map(category => (
        <div key={category} className="category-section">
          <div className="category-header">
            <h3>{categoryDisplayNames[category] || category}</h3>
            <div className="slider-controls">
              <button 
                className="slider-btn" 
                onClick={() => scroll(category, -1)} 
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button 
                className="slider-btn" 
                onClick={() => scroll(category, 1)} 
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>
          
          <div className="category-slider-container-explore">
            <div className="category-courses" ref={categoryRefs[category]}>
              {groupedCourses[category].map(course => (
                <div className="course-card-explore" key={course.id}>
                  <div className="course-image-explore">
                    <img 
                      src={course.image ? 
                        (course.image.startsWith('http') ? course.image : `http://localhost:8000${course.image.startsWith('/') ? course.image : '/' + course.image}`) : 
                        'https://via.placeholder.com/300x180/6a11cb/ffffff?text=Course+Image'
                      } 
                      alt={course.title} 
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.src = 'https://via.placeholder.com/300x180/6a11cb/ffffff?text=Course+Image';
                      }}
                      onLoad={() => console.log('Image loaded successfully:', course.image)}
                    />
                    <div className="course-badge">{course.level}</div>
                  </div>
                  <div className="course-details-explore">
                    <h4>{course.title}</h4>
                    <p>{course.description?.substring(0, 80)}...</p>
                    <div className="course-meta">
                      <span><i className="far fa-clock"></i> {course.duration}</span>
                      <span><i className="fas fa-users"></i> {course.students || '0'} students</span>
                    </div>
                    <Link to={`/explore/course/${course.id}`} className="enroll-btn">View Course</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCategories;