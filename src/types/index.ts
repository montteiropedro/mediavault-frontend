export interface IVideoTrack {
  id: number;
  language: string;
  label: string;
}

export interface IMovie {
  id: string;
  title: string;
  duration_seconds: number;
  cover_art_url: string | null;
  user_progress_seconds: number;
  audio_tracks: IVideoTrack[];
  subtitle_tracks: IVideoTrack[];
  type: 'movie';
}

export interface IEpisode {
  id: string;
  number: number;
  title: string;
  duration_seconds: number;
  thumbnail_url: string | null;
  user_progress_seconds: number;
  audio_tracks: IVideoTrack[];
  subtitle_tracks: IVideoTrack[];
  type: 'episode';
}

export interface ISeason {
  id: string;
  number: number;
  episodes: IEpisode[];
  type: 'season';
}

export interface IShow {
  id: string;
  title: string;
  cover_art_url: string | null;
  seasons: ISeason[];
  type: 'show';
}

export interface IPlayable {
  movies: IMovie[];
  shows: IShow[];
}
