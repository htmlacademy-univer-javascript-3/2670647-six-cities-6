import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
  });

  api.interceptors.request.use((config) => {
    const token =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('six-cities-token')
        : null;
    if (token && config.headers) {
      config.headers['X-Token'] = token;
    }
    return config;
  });

  return api;
};

export default createAPI;
