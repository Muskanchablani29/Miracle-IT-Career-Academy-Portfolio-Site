import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { 
  fetchCourseById, 
  fetchVideosByCourseId, 
  fetchCourseSyllabus,
  enrollInCourse,
  getUserEnrollments
} from '../../api';
import './CourseDetail.css';
import { FaClock, FaBriefcase, FaCertificate, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { UserContext } from '../UserContext';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        setLoading(true);
        const courseData = await fetchCourseById(courseId);
        setCourse(courseData);
        
        const videosData = await fetchVideosByCourseId(courseId);
        setVideos(videosData);
        
        if (videosData.length > 0) {
          setSelectedVideo(videosData[0]);
        }
        
        const syllabusData = await fetchCourseSyllabus(courseId);
        setSyllabus(syllabusData);
        
        // Initialize first module as open
        if (syllabusData.length > 0) {
          setOpenModules({ [syllabusData[0].id]: true });
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
        console.error('Error fetching course details:', err);
      }
    };

    if (courseId) {
      getCourseDetails();
    }
  }, [courseId]);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (user) {
        try {
          const enrollments = await getUserEnrollments();
          const enrolled = enrollments.some(enrollment => enrollment.course === parseInt(courseId));
          setIsEnrolled(enrolled);
        } catch (err) {
          console.error('Error checking enrollment status:', err);
        }
      }
    };

    checkEnrollmentStatus();
  }, [courseId, user]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const toggleModule = (moduleId) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Please log in to enroll in this course');
      return;
    }

    try {
      setEnrolling(true);
      await enrollInCourse(courseId);
      setIsEnrolled(true);
      setEnrolling(false);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div className="error-message">Course not found</div>;
  }

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <h1>{course.title}</h1>
        <div className="course-meta">
          <span className="course-level">{course.level}</span>
          <span className="course-duration">{course.duration}</span>
        </div>
      </div>

      <div className="course-description">
        <h2>About this Course</h2>
        <p>{course.description}</p>
      </div>

      <div className="course-features">
        <div className="feature-card">
          <h3><FaClock /> Course Duration</h3>
          <p>{course.duration}</p>
        </div>
        <div className="feature-card">
          <h3><FaBriefcase /> Internship</h3>
          <p>{course.internship_duration || 'No internship included'}</p>
        </div>
        <div className="feature-card">
          <h3><FaCertificate /> Certification</h3>
          <p>{course.is_certified ? 'Certified Course' : 'No certification'}</p>
        </div>
      </div>

      <div className="course-syllabus">
        <h2><FaBook /> Course Syllabus</h2>
        
        {syllabus.length > 0 ? (
          syllabus.map((module) => (
            <div className="syllabus-module" key={module.id}>
              <div 
                className="module-header" 
                onClick={() => toggleModule(module.id)}
              >
                <h3>
                  <span>{module.order}</span>
                  {module.title}
                </h3>
                {openModules[module.id] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              <div className={`module-content ${openModules[module.id] ? 'open' : ''}`}>
                {module.items.map((item) => (
                  <div className="syllabus-item" key={item.id}>
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No syllabus available for this course yet.</p>
        )}
      </div>

      <div className="course-content">
        <div className="video-container">
          {selectedVideo ? (
            <div className="video-player">
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                allowFullScreen
                frameBorder="0"
              ></iframe>
              <h3>{selectedVideo.title}</h3>
            </div>
          ) : (
            <div className="no-video">No videos available for this course</div>
          )}
        </div>

        <div className="video-playlist">
          <h3>Course Content</h3>
          <ul className="video-list">
            {videos.length > 0 ? (
              videos.map((video) => (
                <li
                  key={video.id}
                  className={`video-item ${selectedVideo && selectedVideo.id === video.id ? 'active' : ''}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <span className="video-order">{video.order}</span>
                  <span className="video-title">{video.title}</span>
                </li>
              ))
            ) : (
              <li className="no-videos-message">No videos available</li>
            )}
          </ul>
        </div>
      </div>

      {isEnrolled ? (
        <div className="enrolled-badge">You are enrolled in this course</div>
      ) : (
        <button 
          className="enroll-button" 
          onClick={handleEnroll}
          disabled={enrolling || !user}
        >
          {enrolling ? 'Enrolling...' : 'Enroll in this Course'}
        </button>
      )}
    </div>
  );
};

export default CourseDetail;