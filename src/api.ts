import axios, { AxiosInstance } from 'axios';

// New server URL from user instruction
const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
  });

  // Attach X-Token header from localStorage for authorization
  api.interceptors.request.use((config) => {
    try {
      const token = localStorage.getItem('six-cities-token');
      if (token && config.headers) {
        config.headers['X-Token'] = token;
      }
    } catch (e) {
      // localStorage may be unavailable in some environments; ignore
    }
    return config;
  });

  return api;
};

export default createAPI;
