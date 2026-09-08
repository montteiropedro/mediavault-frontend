import { useCallback, useEffect, useState, type RefObject } from 'react';
import { usePlatform } from './usePlatform';

export function useFullscreenLandscapeVideo(
  videoContainerRef: RefObject<HTMLVideoElement | HTMLDivElement | null>,
  handleClose?: () => void
) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const { isAndroid } = usePlatform();

  const enterFullscreenLandscape = useCallback(async () => {
    const video = videoContainerRef.current;
    if (!video || !isAndroid) return;

    try {
      if (!video.requestFullscreen) return;

      await video.requestFullscreen();

      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (err) {
      console.warn('Could not force fullscreen/landscape:', err);
    }
  }, [videoContainerRef, isAndroid]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;

      setIsFullscreen((wasFullscreen) => {
        if (wasFullscreen && !isNowFullscreen && isAndroid) {
          handleClose?.();
        }

        return isNowFullscreen;
      });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleClose, isAndroid]);

  return { isFullscreen, enterFullscreenLandscape };
}
