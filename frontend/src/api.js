import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Courses API
export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}courses/courses/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}courses/courses/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error);
    throw error;
  }
};

// Videos API
export const fetchVideosByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}courses/videos/?course_id=${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching videos for course ${courseId}:`, error);
    throw error;
  }
};

// Certificates API
export const fetchCertificates = async () => {
  try {
    const response = await axios.get(`${API_URL}courses/certificates/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

// Workshops API
export const fetchWorkshops = async () => {
  try {
    const response = await axios.get(`${API_URL}courses/workshops/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workshops:', error);
    throw error;
  }
};

// Quizzes API
export const fetchQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}courses/quizzes/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

// Export axios as default for components that need it directly
export default axios;