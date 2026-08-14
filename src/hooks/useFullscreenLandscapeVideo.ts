import { useCallback, useEffect, useState, type RefObject } from 'react';
import { useIsMobile } from './useIsMobile';

export function useFullscreenLandscapeVideo(
  videoRef: RefObject<HTMLVideoElement | HTMLDivElement | null>,
  handleClose?: () => void
) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const enterFullscreenLandscape = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isMobile) return;

    try {
      if (!video.requestFullscreen) return;

      await video.requestFullscreen();

      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (err) {
      console.warn('Could not force fullscreen/landscape:', err);
    }
  }, [videoRef, isMobile]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;

      setIsFullscreen((wasFullscreen) => {
        if (wasFullscreen && !isNowFullscreen && isMobile) {
          handleClose?.();
        }

        return isNowFullscreen;
      });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleClose, isMobile]);

  return { isMobile, isFullscreen, enterFullscreenLandscape };
}
