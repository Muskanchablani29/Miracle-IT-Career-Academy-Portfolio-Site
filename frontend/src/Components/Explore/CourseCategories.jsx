import React from 'react';
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

  return (
    <div className="course-categories">
      <h2>Explore Our Courses</h2>
      
      {sortedCategories.map(category => (
        <div key={category} className="category-section">
          <h3>{categoryDisplayNames[category] || category}</h3>
          <div className="category-courses">
            {groupedCourses[category].map(course => (
              <div className="course-card" key={course.id}>
                <div className="course-image">
                  <img src={course.image || '/placeholder-course.jpg'} alt={course.title} />
                </div>
                <div className="course-details">
                  <h4>{course.title}</h4>
                  <p>{course.description?.substring(0, 100)}...</p>
                  <div className="course-meta">
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                  </div>
                  <Link to={`/explore/course/${course.id}`} className="enroll-btn">View Course</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCategories;