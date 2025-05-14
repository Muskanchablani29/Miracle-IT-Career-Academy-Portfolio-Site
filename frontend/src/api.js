import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCategories = () => API.get('categories/');

export const fetchCourses = (categoryId) => {
  let url = 'courses/';
  if (categoryId) {
    url += `?category=${categoryId}`;
  }
  return API.get(url);
};

export default API;
