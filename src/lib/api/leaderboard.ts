import api from '../axios';
import { LeaderboardEntry, ApiError } from '../types';
import { handleApiError } from './utils';

export interface LeaderboardEntry {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  coins: number;
  shares: number;
  position: number;
}

export const leaderboardApi = {
  getLeaderboard: async () => {
    try {
      const response = await api.get<LeaderboardEntry[]>('/admin/leaderboard');
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  createEntry: async (entryData: { userId: string; coins: number; shares: number }) => {
    try {
      const response = await api.post<LeaderboardEntry | { message: string }>('/admin/leaderboard', entryData);
      if ('message' in response.data) {
        return { data: null, error: { message: response.data.message } };
      }
      return { data: response.data as LeaderboardEntry, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  },

  getEntry: (id: string) => api.get<LeaderboardEntry>(`/admin/leaderboard/${id}`),
  deleteEntry: async (id: string) => {
    try {
      await api.delete(`/admin/leaderboard/${id}`);
      return { error: null };
    } catch (error) {
      return { error: handleApiError(error) };
    }
  }
}; 