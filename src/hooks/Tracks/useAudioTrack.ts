import { useState, useEffect } from 'react';
import type { Playable } from '@/types';

interface UseAudioTrackProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playable: Playable;
  baseUrl: string;
}

export const useAudioTrack = ({ videoRef, audioRef, playable, baseUrl }: UseAudioTrackProps) => {
  const [selectedAudioTrackIndex, setSelectedAudioTrackIndex] = useState<number | null>(null);
  const [isAudioTrackLoading, setIsAudioTrackLoading] = useState(false);

  const waitForCanPlay = (audio: HTMLMediaElement): Promise<void> => {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('error', onError);
      };
      const onCanPlay = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(audio.error ?? new Error('Failed to load audio'));
      };
      audio.addEventListener('canplay', onCanPlay);
      audio.addEventListener('error', onError);
    });
  };

  const handleAudioChange = async (trackIndex: number | null) => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    setSelectedAudioTrackIndex(trackIndex);
    const videoWasPlaying = !video.paused;
    video.pause();

    if (trackIndex === null) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      video.muted = false;

      if (videoWasPlaying) await video.play().catch(console.error);
      return;
    }

    setIsAudioTrackLoading(true);

    try {
      audio.src = `${baseUrl}/api/v1/streaming/${playable.id}/audio/${trackIndex}?type=${playable.type}`;
      audio.muted = false;
      audio.volume = 1;

      await waitForCanPlay(audio);

      audio.currentTime = video.currentTime;
      video.muted = true;

      if (videoWasPlaying) await Promise.all([audio.play(), video.play()]);
    } catch (error) {
      console.error('Error loading selected audio track:', error);
      setSelectedAudioTrackIndex(null);
      video.muted = false;
    } finally {
      setIsAudioTrackLoading(false);
    }
  };

  // Eventos de sincronização de Play, Pause, Seek e Drift
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    const handlePlay = () => {
      if (!audio.src) return;

      audio.currentTime = video.currentTime;
      audio.play().catch(console.error);
    };

    const handlePause = () => audio.pause();

    const handleSeeking = () => audio.src && (audio.currentTime = video.currentTime);

    const handleSync = () => {
      if (selectedAudioTrackIndex === null) return;

      const drift = Math.abs(audio.currentTime - video.currentTime);
      if (drift > 0.3) audio.currentTime = video.currentTime;
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('timeupdate', handleSync);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('timeupdate', handleSync);
    };
  }, [selectedAudioTrackIndex, videoRef, audioRef]);

  return { selectedAudioTrackIndex, isAudioTrackLoading, handleAudioChange };
};
