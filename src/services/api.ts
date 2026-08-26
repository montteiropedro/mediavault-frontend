import axios from 'axios';
import type { IPlayable } from '@/types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utils
export const mediaItemsService = {
  getAll: async (): Promise<MediaItemProps[]> => {
    const response = await api.get<MediaItemProps[]>('/api/v1/media_items');
    return response.data;
  },

  triggerScan: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/api/v1/library/scan');
    return response.data;
  },

  saveProgress: async (mediaItemId: number, progressSeconds: number) => {
    const body = { progress_seconds: progressSeconds };
    const headers = { 'Content-Type': 'application/json' };

    const response = await api.post(`/api/v1/media_items/${mediaItemId}/media_progresses`, body, { headers: headers });
    return response.data;
  },
};
