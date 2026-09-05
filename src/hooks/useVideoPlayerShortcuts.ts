import { useEffect } from 'react';

interface UseVideoPlayerShortcutsProps {
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export function useVideoPlayerShortcuts({
  onTogglePlay,
  onSkip,
  onToggleMute,
  onToggleFullscreen,
  onClose,
}: UseVideoPlayerShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onSkip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onSkip(10);
          break;
        case 'KeyM':
          e.preventDefault();
          onToggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          onToggleFullscreen();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onSkip, onToggleMute, onToggleFullscreen, onClose]);
}
