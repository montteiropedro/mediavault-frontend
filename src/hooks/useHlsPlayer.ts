import { useCallback, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { env } from '@/config/env';
import type { IEpisode, IMovie } from '@/types';

interface UseHlsPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playable: IMovie | IEpisode;
}

export const useHlsPlayer = ({ videoRef, playable }: UseHlsPlayerProps) => {
  const hlsRef = useRef<Hls | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const src = `${env.apiBaseUrl}/api/v1/streaming/${playable.id}/hls/playlist.m3u8`;

  const createHlsLoader = useCallback(() => {
    return class TypedLoader extends Hls.DefaultConfig.loader {
      load(context, config, callbacks) {
        const separator = context.url.includes('?') ? '&' : '?';
        context.url += `${separator}type=${playable.type}`;
        super.load(context, config, callbacks);
      }
    };
  }, [playable]);

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
        loader: createHlsLoader(),
        maxBufferLength: 25,
        maxMaxBufferLength: 30,
        backBufferLength: 10,
      });
      hlsRef.current = hls;

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
    } else if (video.canPlayType('application/vnd.apple.mpegurl') === 'probably') {
      video.src = src;
    } else {
      console.error('Browser does not support HLS');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, videoRef, createHlsLoader]);

  return { isVideoLoading, setIsVideoLoading };
};
