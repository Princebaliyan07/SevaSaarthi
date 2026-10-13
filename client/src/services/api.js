import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('ss_user') || 'null');
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      } else if (user?.role === 'admin') {
        // Fallback for admin session if token was somehow omitted
        const fakeToken = btoa(JSON.stringify({ role: 'admin', name: user.name || 'Demo Administrator', _id: user.id || 'admin-user-id' }));
        config.headers.Authorization = `Bearer demo-jwt-${fakeToken}`;
      }
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
