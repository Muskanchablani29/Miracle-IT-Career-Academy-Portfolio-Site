import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:8000/api/';

// Single axios instance for all API calls
const userAxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Add a request interceptor to include Authorization header if access token is available
userAxiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
userAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log('401 error detected, attempting token refresh');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          console.log('No refresh token available, rejecting');
          return Promise.reject(error);
        }

        // Try to get a new token
        const response = await axios.post(`${API_URL}token/refresh/`, {
          refresh: refreshToken
        });

        if (response.status === 200) {
          console.log('Token refresh successful');
          localStorage.setItem('access', response.data.access);

          // Update the failed request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return userAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// User API (login, signup, etc.)
export const loginUser = async (credentials) => {
  try {
    const response = await userAxiosInstance.post('login/', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Create admin account
export const createAdminAccount = async (adminData) => {
  try {
    const response = await userAxiosInstance.post('create-admin/', adminData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin account:', error);
    throw error;
  }
};

// Create faculty account (admin only)
export const createFacultyAccount = async (facultyData) => {
  try {
    const response = await userAxiosInstance.post('create-faculty/', facultyData);
    return response.data;
  } catch (error) {
    console.error('Error creating faculty account:', error);
    throw error;
  }
};

// Create student account (faculty only)
export const createStudentAccount = async (studentData) => {
  try {
    const response = await userAxiosInstance.post('create-student/', studentData);
    return response.data;
  } catch (error) {
    console.error('Error creating student account:', error);
    throw error;
  }
};

// Courses API
export const fetchCourses = async () => {
  try {
    const response = await userAxiosInstance.get('courses/courses/');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchCourseById = async (id) => {
  try {
    const response = await userAxiosInstance.get(`courses/courses/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error);
    throw error;
  }
};

// Videos API
export const fetchVideosByCourseId = async (courseId) => {
  try {
    const response = await userAxiosInstance.get(`courses/videos/?course_id=${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching videos for course ${courseId}:`, error);
    throw error;
  }
};

// Certificates API
export const fetchCertificates = async () => {
  try {
    const response = await userAxiosInstance.get('certificates/');
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

// Workshops API
export const fetchWorkshops = async () => {
  try {
    const response = await userAxiosInstance.get('workshops/');
    return response.data;
  } catch (error) {
    console.error('Error fetching workshops:', error);
    throw error;
  }
};

// Quizzes API
export const fetchQuizzes = async () => {
  try {
    const response = await userAxiosInstance.get('courses/quizzes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

export { userAxiosInstance };