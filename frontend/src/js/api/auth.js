// Authentication API Client

export class AuthApi {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/auth';
  }
  
  // User registration
  async register(userData) {
    return this.apiClient.post(`${this.endpoint}/register`, userData);
  }
  
  // User login
  async login(credentials) {
    return this.apiClient.post(`${this.endpoint}/login`, credentials);
  }
  
  // Get user profile
  async getProfile() {
    return this.apiClient.get(`${this.endpoint}/profile`);
  }
  
  // Update user profile
  async updateProfile(profileData) {
    return this.apiClient.put(`${this.endpoint}/profile`, profileData);
  }
  
  // Refresh token
  async refreshToken(refreshToken) {
    return this.apiClient.post(`${this.endpoint}/refresh`, { refreshToken });
  }
  
  // Logout (optional - mainly clears server-side sessions)
  async logout() {
    try {
      return this.apiClient.post(`${this.endpoint}/logout`);
    } catch (error) {
      // Logout should work even if API call fails
      console.warn('Logout API call failed:', error);
      return { success: true };
    }
  }
  
  // Change password
  async changePassword(passwordData) {
    return this.apiClient.put(`${this.endpoint}/change-password`, passwordData);
  }
  
  // Request password reset
  async requestPasswordReset(email) {
    return this.apiClient.post(`${this.endpoint}/forgot-password`, { email });
  }
  
  // Reset password with token
  async resetPassword(token, newPassword) {
    return this.apiClient.post(`${this.endpoint}/reset-password`, {
      token,
      password: newPassword
    });
  }
  
  // Verify email
  async verifyEmail(token) {
    return this.apiClient.post(`${this.endpoint}/verify-email`, { token });
  }
  
  // Resend verification email
  async resendVerificationEmail(email) {
    return this.apiClient.post(`${this.endpoint}/resend-verification`, { email });
  }
}