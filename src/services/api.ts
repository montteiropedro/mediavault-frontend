import axios from 'axios';

export interface IMediaItem {
  id: number;
  title: string;
  duration: number;
  media_type: string;
  year?: number;
  file_path: string;
  cover_art_url: string | null;
  video_url?: string | null;
  user_progress_seconds?: number;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utils
export const mediaItemsService = {
  getAll: async (): Promise<IMediaItem[]> => {
    const response = await api.get<IMediaItem[]>('/api/v1/media_items');
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
