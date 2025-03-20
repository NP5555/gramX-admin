import api from '../axios';
import { handleApiError } from './utils';

export interface Task {
  _id: string;
  task: string;
  description: string;
  reward: number;
  platform: 'twitter' | 'youtube' | 'instagram' | 'telegram' | 'other';
  platformId?: string;
  verificationMethod: 'api' | 'manual' | 'screenshot' | 'oauth';
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskPayload = Omit<Task, '_id' | 'createdAt' | 'updatedAt'>;

export const taskApi = {
  getAllTasks: async () => {
    try {
      const response = await api.get<Task[]>('/admin/tasks');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  createTask: async (taskData: CreateTaskPayload) => {
    try {
      const response = await api.post<Task>('/admin/tasks', taskData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  updateTask: async (id: string, taskData: Partial<CreateTaskPayload>) => {
    try {
      const response = await api.put<Task>(`/admin/tasks/${id}`, taskData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  deleteTask: async (id: string) => {
    try {
      await api.delete(`/admin/tasks/${id}`);
      return { error: null };
    } catch (error) {
      return { error: handleApiError(error) };
    }
  },

  getTask: async (id: string) => {
    try {
      const response = await api.get<Task>(`/admin/tasks/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  }
}; 