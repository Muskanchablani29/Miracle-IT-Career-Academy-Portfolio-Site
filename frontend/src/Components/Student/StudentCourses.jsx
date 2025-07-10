import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../../api';
import { FaChevronLeft, FaChevronRight, FaPlay, FaClock, FaUsers, FaCertificate, FaRupeeSign, FaBook, FaVideo, FaChevronDown, FaChevronUp, FaStar, FaGraduationCap, FaMagic, FaRocket, FaFire, FaChartLine } from 'react-icons/fa';
import './StudentCourses.css';

const mockCourses = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    description: 'Learn modern web development with React, Node.js, and MongoDB',
    duration: '6 months',
    level: 'Intermediate',
    price: 25000,
    discount_price: 20000,
    is_certified: true,
    image: null
  },
  {
    id: 2,
    title: 'Python Programming', 
    description: 'Master Python programming from basics to advanced concepts',
    duration: '4 months',
    level: 'Beginner',
    price: 15000,
    discount_price: 12000,
    is_certified: true,
    image: null
  },
  {
    id: 3,
    title: 'Data Science & Analytics',
    description: 'Learn data analysis, machine learning, and visualization',
    duration: '8 months', 
    level: 'Advanced',
    price: 35000,
    discount_price: 28000,
    is_certified: true,
    image: null
  }
];

const StudentCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [courseVideos, setCourseVideos] = useState({});
  const [courseSyllabus, setCourseSyllabus] = useState({});
  const [expandedSyllabus, setExpandedSyllabus] = useState({});
  const [activeTab, setActiveTab] = useState('videos');

  // Sequential video progress - max 8 videos watched
  const getVideoStatus = (videoIndex) => {
    const maxWatchedVideos = 8;
    
    if (videoIndex < maxWatchedVideos - 2) {
      // Completed videos (first 6)
      return { progress: 100, status: 'completed', unlocked: true };
    } else if (videoIndex === maxWatchedVideos - 2) {
      // Currently watching (7th video)
      return { progress: 65, status: 'watching', unlocked: true };
    } else if (videoIndex === maxWatchedVideos - 1) {
      // Next video (8th video)
      return { progress: 0, status: 'next', unlocked: true };
    } else {
      // Locked videos (9th onwards)
      return { progress: 0, status: 'locked', unlocked: false };
    }
  };

  // Calculate course progress based on completed videos
  const calculateCourseProgress = (videos) => {
    if (!videos || videos.length === 0) return 0;
    
    const completedVideos = 6; // First 6 are completed
    const currentVideoProgress = 0.65; // 7th video is 65% watched
    
    const totalProgress = completedVideos + currentVideoProgress;
    const percentage = (totalProgress / videos.length) * 100;
    
    return Math.round(percentage * 10) / 10; // Round to 1 decimal
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      try {
        const profileResponse = await userAxiosInstance.get('student-profile/');
        if (profileResponse.data.course) {
          const enrolledCourse = profileResponse.data.course;
          setEnrolledCourses([{ course: enrolledCourse }]);
          await fetchCourseDetails(enrolledCourse.id);
        } else {
          setEnrolledCourses([]);
        }
      } catch (enrollErr) {
        console.error('Error fetching student profile:', enrollErr);
        setEnrolledCourses([]);
      }
      
      try {
        const response = await fetch('http://localhost:8000/api/courses/courses/');
        const coursesData = await response.json();
        setAllCourses(coursesData);
      } catch (coursesErr) {
        console.error('Error fetching courses:', coursesErr);
        setAllCourses(mockCourses);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const videosResponse = await fetch(`http://localhost:8000/api/courses/videos/?course_id=${courseId}`);
      const videosData = await videosResponse.json();
      setCourseVideos(prev => ({ ...prev, [courseId]: videosData }));
      
      const syllabusResponse = await fetch(`http://localhost:8000/api/courses/syllabus/?course_id=${courseId}`);
      const syllabusData = await syllabusResponse.json();
      setCourseSyllabus(prev => ({ ...prev, [courseId]: syllabusData }));
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const toggleSyllabus = (moduleId) => {
    setExpandedSyllabus(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const selectVideo = (video) => {
    setSelectedVideo(video);
  };

  const updateVideoProgress = async (videoId, percentage) => {
    try {
      await userAxiosInstance.post('video-progress/update_progress/', {
        video_id: videoId,
        percentage: percentage
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  const handleVideoTimeUpdate = (video, currentTime, duration) => {
    if (duration > 0) {
      const percentage = (currentTime / duration) * 100;
      if (percentage > 0 && percentage % 10 < 1) { // Update every 10%
        updateVideoProgress(video.id, percentage);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(allCourses.length - 3, prev + 1));
  };

  if (loading) {
    return (
      <div className="student-courses-dashboard">
        <div className="loading-state-dashboard">
          <div className="loading-spinner"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-courses-dashboard">
        <div className="error-state-dashboard">
          <p>{error}</p>
          <button className="retry-btn-dashboard" onClick={fetchData}>
            <FaRocket />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-courses-dashboard">
      {/* Enrolled Course Section */}
      <div className="modern-section course-section elegant">
        <div className="section-header-modern elegant">
          <div className="header-content-modern">
            <div className="section-badge elegant">
              <FaGraduationCap className="badge-icon" />
              <span>My Course</span>
            </div>
            <h2 className="elegant-title">Current Enrollment</h2>
            <p className="elegant-subtitle">Continue your learning journey</p>
          </div>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="empty-state-dashboard">
            <div className="empty-icon-dashboard">
              <FaRocket />
            </div>
            <h3 className="empty-title-dashboard">Ready to Start Learning?</h3>
            <p className="empty-text-dashboard">Discover curated courses designed for your success</p>
            <button className="modern-btn primary enhanced elegant">
              <FaRocket />
              <span>Explore Courses</span>
              <FaMagic className="btn-sparkle" />
              <div className="btn-ripple"></div>
            </button>
          </div>
        ) : (
          <div className="enrolled-course-dashboard">
            {enrolledCourses.map((enrollment, index) => {
              const course = enrollment.course;
              const courseId = course?.id;
              const videos = courseVideos[courseId] || [];
              const syllabus = courseSyllabus[courseId] || [];
              
              return (
                <div className="course-card-dashboard enhanced" key={enrollment.id || `enrolled-${index}`}>
                  {/* Course Header */}
                  <div className="course-header-dashboard">
                    <div className="course-image-dashboard">
                      {course?.image && course.image !== null && course.image !== '' ? (
                        <img 
                          src={course.image.startsWith('http') ? course.image : `http://localhost:8000${course.image}`} 
                          alt={course.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="image-placeholder-dashboard" style={{display: course?.image ? 'none' : 'flex'}}>
                        <FaGraduationCap />
                      </div>

                    </div>
                    <div className="course-info-dashboard">
                      <div className="course-badges-dashboard">
                        <span className="badge level-badge">{course?.level || 'Beginner'}</span>
                        {course?.is_certified && (
                          <span className="badge certified-badge">
                            <FaCertificate />
                            Certified
                          </span>
                        )}
                      </div>
                      <h1 className="course-title-dashboard-modern">{course?.title || 'Course Title'}</h1>
                      <p className="course-description-dashboard">{course?.description || 'Course description not available'}</p>
                      <div className="course-stats-dashboard">
                        <div className="stat-item-dashboard">
                          <FaClock />
                          <span>{course?.duration || '6 months'}</span>
                        </div>
                        <div className="stat-item-dashboard">
                          <FaUsers />
                          <span>Interactive Learning</span>
                        </div>
                        <div className="stat-item-dashboard">
                          <FaFire />
                          <span>Premium Content</span>
                        </div>
                      </div>
                    </div>
                    <div className="course-progress-section">
                      <div className="progress-circle-dashboard-modern" style={{'--progress': `${(calculateCourseProgress(videos) / 100) * 360}deg`}}>
                        <span className="progress-percentage">{calculateCourseProgress(videos)}%</span>
                        <span className="progress-label">Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="course-content-dashboard">
                    <div className="content-tabs-dashboard">
                      <button 
                        className={`tab-btn-dashboard ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}
                      >
                        <FaVideo />
                        <span>Course Videos</span>
                      </button>
                      <button 
                        className={`tab-btn-dashboard ${activeTab === 'syllabus' ? 'active' : ''}`}
                        onClick={() => setActiveTab('syllabus')}
                      >
                        <FaBook />
                        <span>Syllabus</span>
                      </button>
                    </div>

                    <div className="tab-content-dashboard">
                      {activeTab === 'videos' && (
                        <div className="videos-section-dashboard">
                          {selectedVideo ? (
                            <div className="video-player-dashboard">
                              <div className="video-container-dashboard">
                                <iframe
                                  src={selectedVideo.url}
                                  title={selectedVideo.title}
                                  width="100%"
                                  height="400"
                                  frameBorder="0"
                                  allowFullScreen
                                  onLoad={() => {
                                    // Track video start
                                    updateVideoProgress(selectedVideo.id, 1);
                                  }}
                                ></iframe>
                              </div>
                              <div className="video-controls-dashboard">
                                <h3>{selectedVideo.title}</h3>
                                <button 
                                  className="back-btn-dashboard"
                                  onClick={() => setSelectedVideo(null)}
                                >
                                  ← Back to Videos
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="videos-grid-dashboard">
                              {videos.length > 0 ? videos.map((video, idx) => {
                                // Extract video ID from YouTube URL for thumbnail
                                const getYouTubeThumbnail = (url) => {
                                  if (!url) return null;
                                  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                  return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null;
                                };
                                
                                const thumbnailUrl = getYouTubeThumbnail(video.url);
                                const defaultVideoImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjFGNUY5Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIzMCIgZmlsbD0iIzNCODJGNiIvPgo8cGF0aCBkPSJNMTUwIDc1TDE3NSA5MEwxNTAgMTA1Vjc1WiIgZmlsbD0id2hpdGUiLz4KPHRleHQgeD0iMTYwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4QiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmlkZW8gTGVzc29uPC90ZXh0Pgo8L3N2Zz4K';
                                
                                return (
                                  <div 
                                    key={video.id || idx} 
                                    className={`video-card-dashboard enhanced ${getVideoStatus(idx).status}`}
                                    onClick={() => getVideoStatus(idx).unlocked && selectVideo(video)}
                                    style={{ cursor: getVideoStatus(idx).unlocked ? 'pointer' : 'not-allowed' }}
                                  >
                                    <div className="video-thumbnail-dashboard">
                                      <img 
                                        src={thumbnailUrl || defaultVideoImage} 
                                        alt={video.title}
                                        className="video-thumbnail-image"
                                        onError={(e) => {
                                          e.target.src = defaultVideoImage;
                                        }}
                                      />
                                      <div className="video-overlay-dashboard">
                                        {getVideoStatus(idx).unlocked ? (
                                          <div className="play-button-overlay">
                                            <FaPlay className="play-icon-overlay" />
                                          </div>
                                        ) : (
                                          <div className="locked-overlay">
                                            <div className="lock-icon">🔒</div>
                                          </div>
                                        )}
                                        <div className="video-duration">
                                          {video.duration || '10:30'}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="video-info-dashboard">
                                      <h4>{video.title}</h4>
                                      <div className="video-meta">
                                        <span className="lesson-number">Lesson {idx + 1}</span>
                                        <div className="video-status-container">
                                          {getVideoStatus(idx).status === 'completed' && (
                                            <span className="video-status completed">✓ Completed</span>
                                          )}
                                          {getVideoStatus(idx).status === 'watching' && (
                                            <div className="video-progress-bar">
                                              <div className="progress-fill" style={{width: `${getVideoStatus(idx).progress}%`}}></div>
                                            </div>
                                          )}
                                          {getVideoStatus(idx).status === 'next' && (
                                            <span className="video-status next">▶ Next</span>
                                          )}
                                          {getVideoStatus(idx).status === 'locked' && (
                                            <span className="video-status locked">🔒 Locked</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }) : (
                                <div className="empty-videos-dashboard">
                                  <FaVideo />
                                  <h4>Videos Coming Soon</h4>
                                  <p>Exciting video content will be available shortly</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'syllabus' && (
                        <div className="syllabus-section-dashboard">
                          {syllabus.length > 0 ? (
                            <div className="syllabus-modules-dashboard">
                              {syllabus.map((module, idx) => (
                                <div key={module.id || idx} className="module-dashboard enhanced">
                                  <div 
                                    className="module-header-dashboard"
                                    onClick={() => toggleSyllabus(module.id)}
                                  >
                                    <div className="module-info-dashboard">
                                      <div className="module-number-dashboard">{module.order}</div>
                                      <h4>{module.title}</h4>
                                    </div>
                                    <div className="module-toggle-dashboard">
                                      {expandedSyllabus[module.id] ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                  </div>
                                  {expandedSyllabus[module.id] && (
                                    <div className="module-content-dashboard">
                                      {module.items?.map((item, itemIdx) => (
                                        <div key={item.id || itemIdx} className="module-item-dashboard">
                                          <div className="item-icon-dashboard">
                                            <FaBook />
                                          </div>
                                          <div className="item-content-dashboard">
                                            <h5>{item.title}</h5>
                                            {item.description && <p>{item.description}</p>}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="empty-syllabus-dashboard">
                              <FaBook />
                              <h4>Syllabus Coming Soon</h4>
                              <p>Detailed course structure will be available shortly</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Explore Courses Section */}
      <div className="modern-section explore-section elegant">
        <div className="section-header-modern elegant">
          <div className="header-content-modern">
            <div className="section-badge elegant">
              <FaRocket className="badge-icon" />
              <span>Discover</span>
            </div>
            <h2 className="elegant-title">Explore More Courses</h2>
            <p className="elegant-subtitle">Expand your knowledge with our premium course collection</p>
          </div>
          <div className="nav-controls-dashboard">
            <button 
              className="nav-btn-dashboard" 
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <FaChevronLeft />
            </button>
            <button 
              className="nav-btn-dashboard" 
              onClick={handleNext}
              disabled={currentIndex >= allCourses.length - 3}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        
        <div className="courses-slider-dashboard">
          <div 
            className="courses-track-dashboard"
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {allCourses.map(course => (
              <div className="course-slide-dashboard" key={course.id}>
                <div className="slide-card-dashboard enhanced">
                  <div className="slide-image-dashboard">
                    {course.image && course.image !== null && course.image !== '' ? (
                      <img 
                        src={course.image.startsWith('http') ? course.image : `http://localhost:8000${course.image}`} 
                        alt={course.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="slide-placeholder-dashboard" style={{display: course.image ? 'none' : 'flex'}}>
                      <FaGraduationCap />
                    </div>
                    <div className="slide-overlay-dashboard">
                      <div className="rating-dashboard">
                        <FaStar />
                        <span>4.8</span>
                      </div>
                      <div className="level-tag-dashboard">{course.level}</div>
                    </div>
                  </div>
                  <div className="slide-content-dashboard">
                    <div className="slide-header-dashboard">
                      <h3>{course.title}</h3>
                      {course.is_certified && (
                        <div className="certified-icon-dashboard">
                          <FaCertificate />
                        </div>
                      )}
                    </div>
                    <p className="slide-description-dashboard">{course.description?.substring(0, 80)}...</p>
                    <div className="slide-stats-dashboard">
                      <div className="slide-stat-dashboard">
                        <FaClock />
                        <span>{course.duration}</span>
                      </div>
                      <div className="slide-stat-dashboard">
                        <FaUsers />
                        <span>{course.students_count || 0} Students</span>
                      </div>
                    </div>
                    <div className="price-section-dashboard">
                      {course.discount_price ? (
                        <div className="price-group-dashboard">
                          <span className="original-price-dashboard">₹{course.price}</span>
                          <span className="discount-price-dashboard">₹{course.discount_price}</span>
                          <span className="discount-badge-dashboard">
                            {Math.round(((course.price - course.discount_price) / course.price) * 100)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="price-dashboard">₹{course.price || 'Free'}</span>
                      )}
                    </div>
                    <button className="modern-btn primary enhanced elegant">
                      <FaPlay />
                      <span>Enroll Now</span>
                      <FaMagic className="btn-sparkle" />
                      <div className="btn-ripple"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;