import axios from 'axios';
import { env } from '@/config/env';
import type { IEpisode, IMovie, IPlayable, IShow } from '@/types';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const libraryService = {
  getAll: async (): Promise<IPlayable> => {
    const response = await api.get<IPlayable>('/api/v1/library');
    return response.data;
  },

  getPlayable: async (id: string, type?: 'movie' | 'episode'): Promise<IEpisode | IMovie> => {
    const params = { params: { type } };

    const response = await api.get<IEpisode | IMovie>(`/api/v1/library/${id}`, params);
    return response.data;
  },

  getShow: async (id: string): Promise<IShow> => {
    const response = await api.get<IShow>(`/api/v1/library/${id}?type=show`);
    return response.data;
  },

  triggerScan: async (): Promise<{ message: string }> => {
    const response = await api.get('/api/v1/library/scan');
    return response.data;
  },

  saveProgress: async (playableId: string, playableType: string, progressSeconds: number) => {
    const body = { type: playableType, seconds: progressSeconds };
    const headers = { 'Content-Type': 'application/json' };

    const response = await api.post(`/api/v1/playable/${playableId}/progresses`, body, {
      headers: headers,
    });
    return response.data;
  },
};
