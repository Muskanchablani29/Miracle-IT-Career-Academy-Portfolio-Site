import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchCourseById, 
  fetchVideosByCourseId, 
  fetchCourseSyllabus,
  enrollInCourse,
  getUserEnrollments,
  createPaymentOrder,
  verifyPayment,
  checkEnrollmentStatus,
  submitCourseEnquiry
} from '../../api';
import './CourseDetail.css';
import { FaClock, FaBriefcase, FaCertificate, FaBook, FaChevronDown, FaChevronUp, FaLock } from 'react-icons/fa';
import { UserContext } from '../UserContext';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
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
  const [videoTime, setVideoTime] = useState(0);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const videoRef = useRef(null);

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
    const checkUserEnrollmentStatus = async () => {
      if (user) {
        try {
          const response = await checkEnrollmentStatus(courseId);
          setIsEnrolled(response.is_enrolled);
        } catch (err) {
          console.error('Error checking enrollment status:', err);
          // Fallback to old method if the new endpoint fails
          try {
            const enrollments = await getUserEnrollments();
            const enrolled = enrollments.some(enrollment => enrollment.course === parseInt(courseId));
            setIsEnrolled(enrolled);
          } catch (fallbackErr) {
            console.error('Error with fallback enrollment check:', fallbackErr);
          }
        }
      }
    };

    checkUserEnrollmentStatus();
  }, [courseId, user]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setVideoTime(0); // Reset video time when selecting a new video
    setShowPaymentPrompt(false); // Hide payment prompt when changing videos
  };
  
  // Handle video time update to enforce preview limits
  const handleTimeUpdate = (e) => {
    if (!isEnrolled && selectedVideo) {
      const currentTime = e.target.currentTime;
      setVideoTime(currentTime);
      
      // Check if preview time limit is reached
      if (currentTime >= selectedVideo.preview_duration) {
        if (videoRef.current) {
          videoRef.current.pause();
          setShowPaymentPrompt(true);
        }
      }
    }
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
      
      // Check if course has a price
      if (course.price > 0) {
        // Show payment form
        initiatePayment();
      } else {
        // Free course, direct enrollment
        await enrollInCourse(courseId);
        setIsEnrolled(true);
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setEnrolling(false);
      
      // Check if payment required error
      if (err.response && err.response.status === 402) {
        initiatePayment();
      }
    }
  };
  
  const initiatePayment = async () => {
    try {
      setPaymentProcessing(true);
      setPaymentError(null);
      
      // Create order on server
      const orderData = await createPaymentOrder(courseId);
      
      // Initialize Razorpay
      const options = {
        key: 'rzp_test_your_key_id', // Replace with your actual key
        amount: orderData.amount * 100, // Amount in paisa
        currency: orderData.currency,
        name: 'Course Enrollment',
        description: `Enrollment for ${course.title}`,
        order_id: orderData.order_id,
        handler: function(response) {
          // Handle successful payment
          handlePaymentSuccess(response, orderData.order_id);
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
            setEnrolling(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      console.error('Payment initiation error:', err);
      setPaymentError('Failed to initiate payment. Please try again.');
      setPaymentProcessing(false);
      setEnrolling(false);
    }
  };
  
  const handlePaymentSuccess = async (response, orderId) => {
    try {
      // Verify payment on server
      await verifyPayment({
        payment_id: response.razorpay_payment_id,
        order_id: response.razorpay_order_id,
        signature: response.razorpay_signature,
        course_id: courseId
      });
      
      // Update enrollment status
      setIsEnrolled(true);
      setPaymentProcessing(false);
      setEnrolling(false);
      setShowPaymentPrompt(false);
      
      // Show success message
      alert('Payment successful! You are now enrolled in this course.');
      
    } catch (err) {
      console.error('Payment verification error:', err);
      setPaymentError('Payment verification failed. Please contact support.');
      setPaymentProcessing(false);
      setEnrolling(false);
    }
  };
  
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Add course ID to enquiry data
      const enquiryPayload = {
        ...enquiryData,
        course: courseId
      };
      
      // Submit enquiry
      await submitCourseEnquiry(enquiryPayload);
      
      // Reset form and show success message
      setEnquiryData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      setShowEnquiryForm(false);
      alert('Enquiry submitted successfully! Our team will contact you shortly.');
      
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      alert('Failed to submit enquiry. Please try again.');
    }
  };
  
  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData(prev => ({
      ...prev,
      [name]: value
    }));
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
              {showPaymentPrompt && !isEnrolled ? (
                <div className="payment-prompt">
                  <div className="payment-prompt-content">
                    <h3>Preview Ended</h3>
                    <p>To continue watching this course, you need to enroll.</p>
                    {course.price > 0 ? (
                      <div className="course-price">
                        <h4>Course Fee</h4>
                        <p className="price">
                          {course.discount_price ? (
                            <>
                              <span className="original-price">₹{course.price}</span>
                              <span className="discount-price">₹{course.discount_price}</span>
                            </>
                          ) : (
                            <span>₹{course.price}</span>
                          )}
                        </p>
                        <button 
                          className="enroll-button" 
                          onClick={handleEnroll}
                          disabled={enrolling || paymentProcessing}
                        >
                          {enrolling || paymentProcessing ? 'Processing...' : 'Pay & Enroll Now'}
                        </button>
                        {paymentError && <p className="payment-error">{paymentError}</p>}
                        <div className="enquiry-option">
                          <p>Need more information?</p>
                          <button 
                            className="enquiry-button"
                            onClick={() => setShowEnquiryForm(true)}
                          >
                            Submit an Enquiry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="enroll-button" 
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll for Free'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {selectedVideo.source_type === 'youtube' ? (
                    <div className="youtube-player-wrapper">
                      <iframe
                        src={`${selectedVideo.url}`}
                        title={selectedVideo.title}
                        allowFullScreen
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                      {!isEnrolled && (
                        <div className="preview-overlay" onClick={() => setShowPaymentPrompt(true)}>
                          <div className="preview-message">
                            <FaLock size={24} />
                            <p>Preview limited to {Math.floor(selectedVideo.preview_duration / 60)}:{(selectedVideo.preview_duration % 60).toString().padStart(2, '0')} minutes</p>
                            <button className="preview-button">Enroll to Watch Full Video</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      src={selectedVideo.url}
                      controls
                      onTimeUpdate={handleTimeUpdate}
                      className={!isEnrolled ? "preview-video" : ""}
                    />
                  )}
                  <div className="video-info">
                    <h3>{selectedVideo.title}</h3>
                    {!isEnrolled && (
                      <div className="preview-info">
                        <FaLock /> Preview: {Math.floor(selectedVideo.preview_duration / 60)}:{(selectedVideo.preview_duration % 60).toString().padStart(2, '0')} minutes
                      </div>
                    )}
                  </div>
                </>
              )}
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
                  {!isEnrolled && <FaLock className="lock-icon" />}
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
        <div className="enrollment-section">
          {course && course.price > 0 ? (
            <div className="course-pricing">
              <h3>Course Fee</h3>
              <div className="price-display">
                {course.discount_price ? (
                  <>
                    <span className="original-price">₹{course.price}</span>
                    <span className="discount-price">₹{course.discount_price}</span>
                  </>
                ) : (
                  <span className="regular-price">₹{course.price}</span>
                )}
              </div>
              <button 
                className="enroll-button" 
                onClick={handleEnroll}
                disabled={enrolling || paymentProcessing || !user}
              >
                {enrolling || paymentProcessing ? 'Processing...' : user ? 'Pay & Enroll Now' : 'Login to Enroll'}
              </button>
              <button 
                className="enquiry-button"
                onClick={() => setShowEnquiryForm(true)}
              >
                Submit an Enquiry
              </button>
            </div>
          ) : (
            <button 
              className="enroll-button" 
              onClick={handleEnroll}
              disabled={enrolling || !user}
            >
              {enrolling ? 'Enrolling...' : user ? 'Enroll in this Course' : 'Login to Enroll'}
            </button>
          )}
        </div>
      )}
      
      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="enquiry-modal">
          <div className="enquiry-modal-content">
            <h2>Course Enquiry</h2>
            <button className="close-button" onClick={() => setShowEnquiryForm(false)}>×</button>
            
            <form onSubmit={handleEnquirySubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={enquiryData.name} 
                  onChange={handleEnquiryChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={enquiryData.email} 
                  onChange={handleEnquiryChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={enquiryData.phone} 
                  onChange={handleEnquiryChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={enquiryData.message} 
                  onChange={handleEnquiryChange}
                  rows="4"
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">Submit Enquiry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;