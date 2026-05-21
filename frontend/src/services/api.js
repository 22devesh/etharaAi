import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://etharaai-backend-fnu1.onrender.com/api';

const _envUrl = import.meta.env.VITE_API_URL || 'https://etharaai-backend-fnu1.onrender.com';
const API_BASE_URL = _envUrl.endsWith('/api') ? _envUrl : _envUrl.replace(/\/+$/, '') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Project APIs
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data)
};

// Task APIs
export const taskAPI = {
  createTask: (data) => api.post('/tasks', data),
  getTasks: (params) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getProjectStats: (projectId) => api.get(`/tasks/project/${projectId}/stats`)
};

export default api;
