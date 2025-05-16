import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCourseById, fetchVideosByCourseId } from '../../api';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
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

      <div className="course-description">
        <h2>About this Course</h2>
        <p>{course.description}</p>
      </div>
    </div>
  );
};

export default CourseDetail;