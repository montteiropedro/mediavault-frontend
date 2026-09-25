import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import type { Playable } from '@/types';
import { useHlsAudioTracks } from './Tracks/useHlsAudioTracks';
import { usePlatform } from './usePlatform';

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
  const { isIOS } = usePlatform();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setIsVideoLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const hasNativeHlsSupport = video.canPlayType('application/vnd.apple.mpegurl') !== '';
    const shouldUseNativeHls = isIOS && hasNativeHlsSupport;

    if (shouldUseNativeHls) {
      video.src = src;
      video.currentTime = initialTime;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        startPosition: initialTime,
        maxBufferLength: 60,
        maxMaxBufferLength: 300,
        maxBufferSize: 120 * 1000 * 1000,
        backBufferLength: 30,
        xhrSetup: (xhr) => {
          xhr.withCredentials = true;
          xhr.setRequestHeader('ngrok-skip-browser-warning', 'true');
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
    } else {
      console.error('Browser does not support HLS');
    }
  }, [src, videoRef, initialTime, attach]);

  return { isVideoLoading, setIsVideoLoading, audioTracks, changeAudio, selectedAudio };
};
