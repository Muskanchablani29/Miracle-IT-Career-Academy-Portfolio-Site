import axios from 'axios';

// Axios instance for user-related endpoints (login etc.)
const USER_API_URL = 'http://localhost:8000/api/';
const userAxiosInstance = axios.create({
  baseURL: USER_API_URL,
});

// Axios instance for courses and workshops endpoints
const COURSES_API_URL = 'http://localhost:8000/apii/';
const coursesAxiosInstance = axios.create({
  baseURL: COURSES_API_URL,
});

// Add a request interceptor to include Authorization header if access token is available
const addAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('access');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(userAxiosInstance);
addAuthInterceptor(coursesAxiosInstance);

// User API (login, signup, etc.) - example placeholder
export const loginUser = async (credentials) => {
  try {
    const response = await userAxiosInstance.post('login/', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Courses API
export const fetchCourses = async () => {
  try {
    const response = await coursesAxiosInstance.get('courses/');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchCourseById = async (id) => {
  try {
    const response = await coursesAxiosInstance.get(`courses/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error);
    throw error;
  }
};

// Videos API
export const fetchVideosByCourseId = async (courseId) => {
  try {
    const response = await coursesAxiosInstance.get(`videos/?course_id=${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching videos for course ${courseId}:`, error);
    throw error;
  }
};

// Certificates API
export const fetchCertificates = async () => {
  try {
    const response = await coursesAxiosInstance.get('certificates/');
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

// Workshops API
export const fetchWorkshops = async () => {
  try {
    const response = await coursesAxiosInstance.get('workshops/');
    return response.data;
  } catch (error) {
    console.error('Error fetching workshops:', error);
    throw error;
  }
};

// Quizzes API
export const fetchQuizzes = async () => {
  try {
    const response = await coursesAxiosInstance.get('quizzes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

// Export axios instances as needed
export { userAxiosInstance, coursesAxiosInstance };
export default { userAxiosInstance, coursesAxiosInstance };
