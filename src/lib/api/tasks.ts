import api from '../axios';
import { Task } from '../types';
import { handleApiError } from './utils';

export const taskApi = {
  getAllTasks: async () => {
    try {
      const response = await api.get<Task[]>('/api/tasks');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  createTask: async (taskData: Omit<Task, '_id'>) => {
    try {
      const response = await api.post<Task>('/api/tasks', taskData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  updateTask: async (id: string, taskData: Partial<Task>) => {
    try {
      const response = await api.put<Task>(`/api/tasks/${id}`, taskData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  deleteTask: async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      return { error: null };
    } catch (error) {
      return { error: handleApiError(error) };
    }
  },

  getTask: async (id: string) => {
    try {
      const response = await api.get<Task>(`/api/tasks/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  }
}; 