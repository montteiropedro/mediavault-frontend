import axios from 'axios';
import { env } from '@/config/env';
import type { Episode, Library, Movie, Show } from '@/types';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const libraryService = {
  getAll: async (): Promise<Library> => {
    const response = await api.get<Library>('/api/v1/library');
    return response.data;
  },

  getPlayable: async (id: string, type?: 'movie' | 'episode'): Promise<Episode | Movie> => {
    const response = await api.get<Episode | Movie>(`/api/v1/library/${type}/${id}`);
    return response.data;
  },

  getShow: async (id: string): Promise<Show> => {
    const response = await api.get<Show>(`/api/v1/library/show/${id}`);
    return response.data;
  },

  triggerScan: async (): Promise<{ job_id: string }> => {
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
