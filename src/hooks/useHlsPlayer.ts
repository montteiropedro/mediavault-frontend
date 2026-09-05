import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import type { Playable } from '@/types';
import { useHlsAudioTracks } from './Tracks/useHlsAudioTracks';

type UseHlsPlayerProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playable: Playable;
};

export const useHlsPlayer = ({ videoRef, playable }: UseHlsPlayerProps) => {
  const hlsRef = useRef<Hls | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const src = `${playable.hls_url}`;
  const initialTime = playable.user_progress_seconds || 0;

  const { audioTracks, changeAudio, selectedAudio, attach } = useHlsAudioTracks();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsVideoLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        startPosition: initialTime,
        maxBufferLength: 25,
        maxMaxBufferLength: 30,
        backBufferLength: 10,
        xhrSetup: (xhr) => {
          xhr.withCredentials = true;
        },
      });
      hlsRef.current = hls;

      const detachAudioTracks = attach(hls);

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            hlsRef.current = null;
            break;
        }
      });

      return () => {
        detachAudioTracks();
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl') === 'probably') {
      video.src = src;
    } else {
      console.error('Browser does not support HLS');
    }
  }, [src, videoRef, initialTime, attach]);

  return { isVideoLoading, setIsVideoLoading, audioTracks, changeAudio, selectedAudio };
};
