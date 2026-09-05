import { type MediaPlaylist } from 'hls.js';

export type AudioTrack = Pick<MediaPlaylist, 'id' | 'name' | 'lang' | 'default'>;

export type SubtitleTrack = {
  id: number;
  label: string;
  language: string;
};

export type VideoTrack = {
  id: number;
  language: string;
  label: string;
};

export type Playable = {
  id: string;
  title: string;
  duration_seconds: number;
  user_progress_seconds: number;
  audio_tracks: VideoTrack[];
  subtitle_tracks: VideoTrack[];
  hls_url: string;
  playable: true;
  type: 'episode' | 'movie';
};

export type Movie = Playable & {
  cover_art_url: string | null;
  type: 'movie';
};

export type Episode = Playable & {
  number: number;
  thumbnail_url: string | null;
  type: 'episode';
};

export type Season = {
  id: string;
  number: number;
  episodes: Episode[];
  playable: false;
  type: 'season';
};

export type Show = {
  id: string;
  title: string;
  cover_art_url: string | null;
  seasons: Season[];
  playable: false;
  type: 'show';
};

export type Library = {
  movies: Movie[];
  shows: Show[];
};
