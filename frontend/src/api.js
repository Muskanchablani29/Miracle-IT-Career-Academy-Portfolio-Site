import axios from 'axios';

// Axios instance for user-related endpoints (login etc.)
const USER_API_URL = 'http://localhost:8000/api/';
const userAxiosInstance = axios.create({
  baseURL: USER_API_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Axios instance for courses and workshops endpoints
const COURSES_API_URL = 'http://localhost:8000/apii/';
const coursesAxiosInstance = axios.create({
  baseURL: COURSES_API_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Add a request interceptor to include Authorization header if access token is available
const addAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
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
 axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Try to get a new token
        const response = await axios.post(`${USER_API_URL}token/refresh/`, {
          refresh: refreshToken
        });

        if (response.status === 200) {
          localStorage.setItem('access', response.data.access);

          // Update the failed request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear tokens if refresh fails
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

};

addAuthInterceptor(userAxiosInstance);
addAuthInterceptor(coursesAxiosInstance);

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
    console.log('Creating faculty with data:', facultyData);
    console.log('Auth token:', localStorage.getItem('access'));
    
    // Log request headers for debugging
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
      'Content-Type': 'application/json'
    };
    console.log('Request headers:', headers);
    
    const response = await userAxiosInstance.post('create-faculty/', facultyData, { 
      headers: headers 
    });
    return response.data;
  } catch (error) {
    console.error('Error creating faculty account:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

// Create student account (faculty only)
export const createStudentAccount = async (studentData) => {
  try {
    console.log('Creating student with data:', studentData);
    console.log('Auth token:', localStorage.getItem('access'));
    
    // Log request headers for debugging
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
      'Content-Type': 'application/json'
    };
    console.log('Request headers:', headers);
    
    const response = await userAxiosInstance.post('create-student/', studentData, { 
      headers: headers 
    });
    return response.data;
  } catch (error) {
    console.error('Error creating student account:', error);
    console.error('Error response:', error.response);
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
