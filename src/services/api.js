import axios from 'axios';
import { API_BASE_URL } from './endpoints';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET || 'g08A3qQy00y8nDaoIMqZDHjvTrNTUs5T',
    'x-hasura-role': 'user',
    'x-hasura-user-id': '1',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred while contacting the server',
      status: error.response?.status,
      original: error,
    };
    return Promise.reject(customError);
  }
);

export default api;
