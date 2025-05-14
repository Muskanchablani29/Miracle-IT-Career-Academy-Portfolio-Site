import React, { useEffect, useState } from 'react';
import CoursePlayer from './CoursePlayer';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  useEffect(() => {
    // Fetch courses from API
    fetch('/api/courses/')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        if (data.length > 0) {
          setSelectedPlaylistId(data[0].youtube_playlist_id);
        }
      })
      .catch(err => console.error('Failed to fetch courses:', err));
  }, []);

  const onSelectCourse = (playlistId) => {
    setSelectedPlaylistId(playlistId);
  };

  return (
    <div className="courses-page" style={{ display: 'flex', gap: '20px' }}>
      <div className="courses-list" style={{ flex: 1, overflowY: 'auto', maxHeight: '80vh' }}>
        <h2>Courses</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {courses.map(course => (
            <li 
              key={course.id} 
              onClick={() => onSelectCourse(course.youtube_playlist_id)}
              style={{ cursor: 'pointer', marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p><strong>Category:</strong> {course.category.name}</p>
              <p><strong>Language:</strong> {course.language}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="course-player-section" style={{ flex: 2 }}>
        {selectedPlaylistId ? (
          <CoursePlayer youtubePlaylistId={selectedPlaylistId} />
        ) : (
          <p>Select a course to view videos</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
