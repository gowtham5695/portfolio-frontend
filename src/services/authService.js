import api from './api';

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('admin_token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
  },

  getCurrentAdmin: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/auth/password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  },
};

export default authService;
