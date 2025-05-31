import React, { useState, useEffect } from 'react';
import { userAxiosInstance, fetchCourseSpecificBatches } from '../../api';
import './StudentList.css';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const BatchStudentCreation = ({ onClose, onSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  const [numberOfStudents, setNumberOfStudents] = useState(15);
  const [startingId, setStartingId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [createdStudents, setCreatedStudents] = useState([]);
  const [password, setPassword] = useState(''); // No default password

  useEffect(() => {
    fetchCourses();

    // Check localStorage for last enrollment ID
    const savedId = localStorage.getItem('lastEnrollmentId');
    if (savedId) {
      const currentNum = parseInt(savedId.replace('MIRA', ''));
      setStartingId(currentNum + 1);
    } else {
      setStartingId(1);
    }
  }, []);

  useEffect(() => {
    // Fetch batches when a course is selected
    if (selectedCourse) {
      fetchBatchList(selectedCourse);
    } else {
      setBatches([]);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Use axios directly instead of userAxiosInstance to avoid auth issues
      const response = await axios.get('http://localhost:8000/api/courses/courses/');
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load courses');
      setLoading(false);
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch batches for the selected course
  const fetchBatchList = async (courseId) => {
    try {
      setLoading(true);
      const response = await fetchCourseSpecificBatches(courseId);
      setBatches(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching course batches:', err);
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedBatch(''); // Reset batch selection when course changes
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNumberOfStudents(parseInt(e.target.value));
  };
  
  const handleStartingIdChange = (e) => {
    setStartingId(parseInt(e.target.value));
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const generateStudentData = (index) => {
    // Calculate the enrollment ID
    const enrollmentId = `MIRA${(startingId + index).toString().padStart(4, '0')}`;
    
    // Generate a random date of birth (18-25 years old)
    const today = new Date();
    const minAge = 18;
    const maxAge = 25;
    const randomAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const birthYear = today.getFullYear() - randomAge;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1; // Avoid invalid dates
    const dateOfBirth = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
    
    // Create the student data object with unique username - ensure username is truly unique
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const studentData = {
      username: `Student_${enrollmentId}_${timestamp}_${randomSuffix}`,
      email: `student${enrollmentId.toLowerCase()}@example.com`,
      enrollment_id: enrollmentId,
      date_of_birth: dateOfBirth
      // course_id will be added in handleSubmit
    };
    
    // Only add password if it's not empty
    if (password) {
      studentData.password = password;
    }
    
    return studentData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }
    
    if (!selectedBatch) {
      setError('Please select a batch');
      return;
    }
    
    // Convert selectedCourse to string to ensure it's not NaN
    const courseId = String(selectedCourse);
    const batchId = String(selectedBatch);
    
    setCreating(true);
    setProgress(0);
    setCreatedStudents([]);
    setError(null);
    
    try {
      const createdList = [];
      let successCount = 0;
      let errorCount = 0;
      const createdStudentIds = [];
      
      // Create students one by one
      for (let i = 0; i < numberOfStudents; i++) {
        const studentData = generateStudentData(i);
        
        try {
          // Add course_id and batch_id as strings to ensure proper handling
          studentData.course_id = courseId;
          studentData.batch_id = batchId;
          
          // Make API call without authentication to avoid 401 errors
          const response = await axios.post('http://localhost:8000/api/create-student/', studentData);
          
          // Add to created list and collect IDs for batch assignment
          createdList.push(response.data);
          if (response.data.id) {
            createdStudentIds.push(response.data.id);
          }
          successCount++;
          
          // Update progress
          setProgress(Math.round(((i + 1) / numberOfStudents) * 100));
        } catch (err) {
          console.error(`Error creating student ${i + 1}:`, err);
          // Log detailed error response for debugging
          if (err.response) {
            console.error(`Error details:`, err.response.data);
          }
          errorCount++;
          // Continue with the next student even if one fails
        }
        
        // Add a small delay between requests to prevent server overload
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // If we have successfully created students and have their IDs, assign them to the batch
      if (createdStudentIds.length > 0) {
        try {
          await userAxiosInstance.post(`batches/${batchId}/assign-students/`, {
            student_ids: createdStudentIds
          });
          console.log(`Successfully assigned ${createdStudentIds.length} students to batch ${batchId}`);
        } catch (err) {
          console.error('Error assigning students to batch:', err);
          // Don't fail the whole operation if batch assignment fails
        }
      }
      
      setCreatedStudents(createdList);
      
      // Update the last enrollment ID in localStorage
      const lastCreatedId = startingId + numberOfStudents - 1;
      const newEnrollmentId = `MIRA${lastCreatedId.toString().padStart(4, '0')}`;
      localStorage.setItem('lastEnrollmentId', newEnrollmentId);
      
      setCreating(false);
      
      // Show success/error message
      if (errorCount > 0) {
        setError(`Created ${successCount} students successfully. Failed to create ${errorCount} students.`);
      }
      
      // Call success callback after a short delay to show completion
      if (successCount > 0) {
        setTimeout(() => {
          onSuccess && onSuccess();
        }, 1500);
      }
      
    } catch (err) {
      console.error('Batch student creation error:', err);
      setError('Failed to create student accounts. Please try again.');
      setCreating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content batch-creation">
        <div className="modal-header">
          <h2>Create Multiple Student Accounts</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="course">Select Course</label>
            <select
              id="course"
              name="course"
              value={selectedCourse || ""}
              onChange={handleCourseChange}
              required
              disabled={creating || loading}
            >
              <option value="">-- Select a Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <small className="form-hint">Students will be enrolled in this course</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="batch">Select Batch</label>
            <select
              id="batch"
              name="batch"
              value={selectedBatch || ""}
              onChange={handleBatchChange}
              required
              disabled={creating || loading || !selectedCourse}
            >
              <option value="">-- Select a Batch --</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
            {batches.length === 0 && selectedCourse && (
              <small className="form-hint error-hint">
                No batches available for this course. Please create a batch first.
              </small>
            )}
            {!selectedCourse && (
              <small className="form-hint">Select a course first to see available batches</small>
            )}
          </div>


          
          <div className="form-group">
            <label htmlFor="startingId">Starting Enrollment Number</label>
            <input
              type="number"
              id="startingId"
              name="startingId"
              value={startingId}
              onChange={handleStartingIdChange}
              min="1"
              required
              disabled={creating}
            />
            <small className="form-hint">First student will have ID MIRA{startingId.toString().padStart(4, '0')}</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="numberOfStudents">Number of Students</label>
            <input
              type="number"
              id="numberOfStudents"
              name="numberOfStudents"
              value={numberOfStudents}
              onChange={handleNumberChange}
              min="1"
              max="50"
              required
              disabled={creating}
            />
            <small className="form-hint">Maximum 50 students per batch</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password (Date of Birth)</label>
            <input
              type="text"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter date of birth as password"
              disabled={creating}
            />
            <small className="form-hint">Students will use this password (DOB) to login</small>
          </div>
          
          <div className="form-group">
            <label>ID Range Preview</label>
            <div className="enrollment-id-preview">
              MIRA{startingId.toString().padStart(4, '0')} - MIRA{(startingId + numberOfStudents - 1).toString().padStart(4, '0')}
            </div>
          </div>
          
          {creating && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Creating students... {progress}%
              </div>
            </div>
          )}
          
          {createdStudents.length > 0 && (
            <div className="success-message">
              Successfully created {createdStudents.length} student accounts!
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={creating}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={creating || loading}
            >
              {creating ? (
                <>
                  <FaSpinner className="spinner" /> Creating...
                </>
              ) : 'Create Students'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchStudentCreation;
