import api from '../axios';
import { handleApiError } from './utils';

export interface Batch {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'pending';
  participants: string[]; // array of user IDs
  createdAt: Date;
  updatedAt: Date;
}

export const batchApi = {
  getAllBatches: async () => {
    try {
      const response = await api.get<Batch[]>('/admin/batches');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  createBatch: async (batchData: Partial<Batch>) => {
    try {
      const response = await api.post<Batch>('/admin/batches', batchData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  getBatch: async (id: string) => {
    try {
      const response = await api.get<Batch>(`/admin/batches/${id}`);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  updateBatch: async (id: string, batchData: Partial<Batch>) => {
    try {
      const response = await api.put<Batch>(`/admin/batches/${id}`, batchData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  deleteBatch: async (id: string) => {
    try {
      await api.delete(`/admin/batches/${id}`);
      return { error: null };
    } catch (error) {
      return { error: handleApiError(error) };
    }
  }
}; 