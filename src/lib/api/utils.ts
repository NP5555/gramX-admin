import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      message: axiosError.response?.data?.message || axiosError.message,
      status: axiosError.response?.status
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred'
  };
}; 