import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('rwai_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// AI
export const aiGenerateListing = (data) => api.post('/ai/generate-listing', data);
export const aiChat = (data) => api.post('/ai/chat', data);
export const aiPricePredict = (data) => api.post('/ai/price-predict', data);

export default api;
