import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './components.css';
import { fetchLatestCourses, fetchWorkshops } from '../../api';
import { FaCalendarAlt, FaBook, FaClock, FaChalkboardTeacher } from 'react-icons/fa';

const Workshops = () => {
  const [workshopsList, setWorkshopsList] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use fetchWorkshops from api.js instead of direct axios call
        const workshopsData = await fetchWorkshops();
        const coursesData = await fetchLatestCourses();
        
        setWorkshopsList(Array.isArray(workshopsData) ? workshopsData : []);
        setLatestCourses(coursesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workshops:', err);
        // Continue showing courses even if workshops fail to load
        try {
          const coursesData = await fetchLatestCourses();
          setLatestCourses(coursesData);
        } catch (courseErr) {
          console.error('Error fetching courses:', courseErr);
        }
        setWorkshopsList([]);
        setError('Failed to load workshop data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading content...</div>;
  }

  return (
    <div className="workshops-container">
      <section className="workshops-section">
        <h2><FaCalendarAlt className="section-icon" /> Attend a Workshop</h2>
        <p>Join our interactive workshops to gain hands-on experience and network with professionals.</p>
        
        {error ? (
          <div className="error-message">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="workshops-list">
            {workshopsList.length > 0 ? (
              workshopsList.map((workshop) => (
                <div className="workshop-card" key={workshop.id}>
                  <div className="workshop-image">
                    <img 
                      src={workshop.image ? workshop.image : ''} 
                      alt={workshop.title} 
                    />
                  </div>
                  <div className="workshop-details">
                    <h3>{workshop.title}</h3>
                    <p>{workshop.description}</p>
                    <div className="workshop-meta">
                      <div className="workshop-date">
                        <strong>Date:</strong> {workshop.date}
                      </div>
                      <div className="workshop-location">
                        <strong>Location:</strong> {workshop.location}
                      </div>
                      <div className="workshop-seats">
                        <strong>Available Seats:</strong> {workshop.available_seats}
                      </div>
                    </div>
                    <button className="register-btn">Register Now</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No workshops available at the moment.</p>
            )}
          </div>
        )}
      </section>
      
      <section className="latest-courses-section">
        <h2><FaBook className="section-icon" /> Latest Courses</h2>
        <p>Check out our newest courses and learning opportunities</p>
        
        <div className="latest-courses-list">
          {latestCourses.length > 0 ? (
            latestCourses.map((course) => (
              <div className="course-card" key={course.id}>
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                </div>
                <div className="course-details">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description.substring(0, 120)}...</p>
                  <div className="course-meta">
                    <div className="course-duration">
                      <FaClock /> {course.duration}
                    </div>
                    <div className="course-level">
                      <FaChalkboardTeacher /> {course.level}
                    </div>
                  </div>
                  <Link to={`/explore/courses/${course.id}`} className="view-course-btn">
                    View Course
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No new courses available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Workshops;
