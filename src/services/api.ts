// API Configuration
// This service helps manage API URLs across different environments

// In production, the API is hosted on AWS
// In development, the API is proxied through Vite
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://YOUR_AWS_EB_URL.elasticbeanstalk.com' // Replace with your actual AWS Elastic Beanstalk URL
  : '/api';

export default {
  // Group match endpoints
  matches: {
    getAll: () => `${API_BASE_URL}/api/matches`,
    update: (index: number) => `${API_BASE_URL}/api/matches/${index}`,
  },
  
  // Knockout match endpoints
  knockout: {
    getAll: () => `${API_BASE_URL}/api/knockout`,
    update: (round: string, index: number) => `${API_BASE_URL}/api/knockout/${round}/${index}`,
  },
  
  // Health check endpoint
  health: () => `${API_BASE_URL}/api/health`,
}; 