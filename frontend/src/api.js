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

// Admin axios instance for admin-specific operations
const adminAxiosInstance = axios.create({
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

// Add the same interceptor to the admin instance
adminAxiosInstance.interceptors.request.use(
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

    // Check if error is due to an expired token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log('401 error detected, attempting token refresh');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          console.log('No refresh token available, redirecting to login');
          // You might want to redirect to login page here
          // window.location.href = '/login';
          return Promise.reject(error);
        }

        // Try to get a new token
        const response = await axios.post(`${API_URL}token/refresh/`, {
          refresh: refreshToken
        });

        if (response.status === 200) {
          console.log('Token refresh successful');
          
          // Store the new access token
          localStorage.setItem('access', response.data.access);

          // Update the authorization header for all future requests
          userAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          adminAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          
          // Update the failed request with the new token and retry it
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return userAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear tokens from storage on refresh failure
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        
        // You might want to redirect to login page here
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Add the same response interceptor to the admin instance
adminAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to an expired token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log('401 error detected, attempting token refresh');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          console.log('No refresh token available, redirecting to login');
          return Promise.reject(error);
        }

        // Try to get a new token
        const response = await axios.post(`${API_URL}token/refresh/`, {
          refresh: refreshToken
        });

        if (response.status === 200) {
          console.log('Token refresh successful');
          
          // Store the new access token
          localStorage.setItem('access', response.data.access);

          // Update the authorization header for all future requests
          userAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          adminAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          
          // Update the failed request with the new token and retry it
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return adminAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear tokens from storage on refresh failure
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

// Courses API - Public endpoint that doesn't require authentication
export const fetchCourses = async () => {
  try {
    // Use axios directly instead of userAxiosInstance to avoid authentication requirements
    const response = await axios.get(`${API_URL}courses/courses/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Create a new course (admin and faculty only)
export const createCourse = async (courseData) => {
  try {
    const response = await adminAxiosInstance.post('courses/create-course/', courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Fetch latest courses for workshops page
export const fetchLatestCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}courses/latest-courses/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest courses:', error);
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

// Syllabus API
export const fetchCourseSyllabus = async (courseId) => {
  try {
    const response = await userAxiosInstance.get(`courses/syllabus/?course_id=${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching syllabus for course ${courseId}:`, error);
    throw error;
  }
};

export const fetchSyllabusItems = async (moduleId) => {
  try {
    const response = await userAxiosInstance.get(`courses/syllabus-items/?module_id=${moduleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching syllabus items for module ${moduleId}:`, error);
    throw error;
  }
};

// Create and update syllabus (for faculty and admin)
export const createCourseSyllabus = async (syllabusData) => {
  try {
    const response = await adminAxiosInstance.post('courses/syllabus/', syllabusData);
    return response.data;
  } catch (error) {
    console.error('Error creating course syllabus:', error);
    throw error;
  }
};

export const updateCourseSyllabus = async (moduleId, syllabusData) => {
  try {
    const response = await adminAxiosInstance.put(`courses/syllabus/${moduleId}/`, syllabusData);
    return response.data;
  } catch (error) {
    console.error(`Error updating syllabus module ${moduleId}:`, error);
    throw error;
  }
};

export const createSyllabusItem = async (itemData) => {
  try {
    const response = await adminAxiosInstance.post('courses/syllabus-items/', itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating syllabus item:', error);
    throw error;
  }
};

export const updateSyllabusItem = async (itemId, itemData) => {
  try {
    const response = await adminAxiosInstance.put(`courses/syllabus-items/${itemId}/`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating syllabus item ${itemId}:`, error);
    throw error;
  }
};

// Course Enrollment API
export const enrollInCourse = async (courseId) => {
  try {
    const response = await userAxiosInstance.post('enroll/', { course_id: courseId });
    return response.data;
  } catch (error) {
    console.error(`Error enrolling in course ${courseId}:`, error);
    throw error;
  }
};

export const getUserEnrollments = async () => {
  try {
    const response = await userAxiosInstance.get('enrollments/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }
};

// Notifications API
export const fetchUserNotifications = async () => {
  try {
    // Get notifications from user dashboard endpoint
    const response = await userAxiosInstance.get('dashboard/');
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Fetch course update notifications
export const fetchCourseUpdateNotifications = async () => {
  try {
    const response = await userAxiosInstance.get('courses/notifications/course_updates/');
    return response.data;
  } catch (error) {
    console.error('Error fetching course update notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await userAxiosInstance.post(`notifications/${notificationId}/read/`);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
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

export { userAxiosInstance, adminAxiosInstance };