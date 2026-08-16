import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useIsMobile } from './useIsMobile';

interface UseControlsVisibilityOptionsProps {
  timeout?: number;
}

export function useControlsVisibility(
  videoRef: RefObject<HTMLVideoElement | null>,
  { timeout = 3000 }: UseControlsVisibilityOptionsProps = {}
) {
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringControlsRef = useRef<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);

  const isMobile = useIsMobile();

  const clearHideTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    if (!isPlayingRef.current) return;

    timerRef.current = setTimeout(() => {
      if (!isHoveringControlsRef.current || isMobile) setControlsVisible(false);
    }, timeout);
  }, [timeout, isMobile]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  const hideControls = useCallback(() => {
    clearHideTimer();
    setControlsVisible(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      isPlayingRef.current = true;
      scheduleHide();
    };
    const onPause = () => {
      isPlayingRef.current = false;
      clearHideTimer();
      setControlsVisible(true);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [videoRef, scheduleHide]);

  return {
    controlsVisible,
    showControls,
    hideControls,
    scheduleHide,
    onControlsMouseEnter: () => {
      isHoveringControlsRef.current = true;
    },
    onControlsMouseLeave: () => {
      isHoveringControlsRef.current = false;
      scheduleHide();
    },
  };
}
