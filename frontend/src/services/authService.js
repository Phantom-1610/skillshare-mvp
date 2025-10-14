import api from './api';

class AuthService {
  setAuthToken(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete api.defaults.headers.common['Authorization'];
  }

  // Auth endpoints
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response;
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  }

  async getMe() {
    const response = await api.get('/auth/me');
    return response;
  }

  async updatePassword(passwordData) {
    const response = await api.put('/auth/update-password', passwordData);
    return response;
  }

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  }

  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response;
  }

  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response;
  }

  async resendVerification() {
    const response = await api.post('/auth/resend-verification');
    return response;
  }

  async logout() {
    const response = await api.post('/auth/logout');
    return response;
  }

  // Profile endpoints
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response;
  }

  async addSkill(skillData) {
    const response = await api.post('/users/skills', skillData);
    return response;
  }

  async removeSkill(skillId, type = 'offered') {
    const response = await api.delete(`/users/skills/${skillId}?type=${type}`);
    return response;
  }

  async updateAvailability(availabilityData) {
    const response = await api.put('/users/availability', availabilityData);
    return response;
  }
}

export const authService = new AuthService();
