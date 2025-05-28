// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000
};

// Auto-detect API URL based on environment
export const getApiBaseUrl = () => {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    return 'http://localhost:3001/api'\;
  } else {
    return '/api'; // Production - same domain
  }
};
