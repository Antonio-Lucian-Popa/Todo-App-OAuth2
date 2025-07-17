import axios from 'axios';
import useAuthStore from '../store/authStore';

// Auth API instance
const authApi = axios.create({
  //baseURL: 'http://localhost:8080', // Auth backend URL
  baseURL: 'http://antonio-dev.go.ro:8081/auth-server-api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Todo API instance
const todoApi = axios.create({
  baseURL: 'http://localhost:8081', // Todo backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor pentru todo API - adaugă Authorization header
todoApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor pentru todo API - refresh token automat
todoApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await authApi.post('/api/auth/refresh', {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        useAuthStore.getState().setTokens(accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return todoApi(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export { authApi, todoApi };