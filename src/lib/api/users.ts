import api from '../axios';
import { handleApiError, ApiError } from './utils';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  // add other user fields as needed
}

export const userApi = {
  getAllUsers: async () => {
    try {
      const response = await api.get<User[]>('/admin/users');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  createUser: async (userData: Partial<User>) => {
    try {
      const response = await api.post<User>('/admin/users', userData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  getUser: (id: string) => api.get<User>(`/admin/users/${id}`),

  updateUser: (id: string, userData: Partial<User>) => api.put<User>(`/admin/users/${id}`, userData),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  getUserProfile: (id: string) => api.get<User>(`/user/${id}`)
}; 