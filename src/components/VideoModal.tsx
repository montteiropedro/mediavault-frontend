import { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize } from 'lucide-react';
import { mediaItemsService, type IMediaItem } from '../services/api';

interface VideoModalProps {
  mediaItem: IMediaItem | null;
  onClose: () => void;
  onProgressUpdate: (mediaItemId: number, seconds: number) => void;
}

export function VideoModal({ mediaItem, onClose, onProgressUpdate }: VideoModalProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const initialTime = mediaItem?.user_progress_seconds || 0;
  const currentProgressRef = useRef<number>(initialTime);
  const lastSavedTimeRef = useRef<number>(initialTime);

  //====================================================================//
  // Navigation and control functions (+/- 10s, play/pause, fullscreen) //
  //====================================================================//

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds)
    );
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  //================//
  // Track metadata //
  //================//

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);

    // Restores user progress
    const isCompleted = mediaItem?.duration && initialTime / mediaItem.duration >= 0.95;

    if (initialTime > 0 && !isCompleted) {
      videoRef.current.currentTime = initialTime;
    }
  };

  //=========================//
  // Persistence of progress //
  //=========================//

  const saveProgressToBackend = async (time: number) => {
    // Prevents repeated calls for the same time
    if (!mediaItem || Math.abs(time - lastSavedTimeRef.current) < 2) return;

    try {
      lastSavedTimeRef.current = time;
      onProgressUpdate(mediaItem.id, time);
      await mediaItemsService.saveProgress(mediaItem.id, time);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const time = Math.floor(videoRef.current.currentTime);

    if (time > 0 && time % 5 === 0) {
      setCurrentTime(time);
      currentProgressRef.current = time;
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      saveProgressToBackend(time);
    }
    onClose();
  };

  //===================//
  // Keyboard keybinds //
  //===================//

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          handleClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mediaItem) return null;

  return (
    <div
      ref={videoContainerRef}
      onClick={togglePlay}
      className="fixed z-50 inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden py-24"
    >
      <div className="w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={mediaItem.video_url}
          autoPlay
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPause={() => {
            if (videoRef.current) {
              const time = Math.floor(videoRef.current.currentTime);
              saveProgressToBackend(time);
            }
          }}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Control overlay */}
      <div className="absolute inset-0 z-50 bg-linear-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
        {/* Top bar controls */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="flex flex-row-reverse"
        >
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white flex items-center justify-center rounded-full cursor-pointer"
          >
            <X className="size-8" />
          </button>
        </div>

        {/* Bottom bar controls */}
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-2">
          {/* Seekbar/Remaining duration */}
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value);
                if (videoRef.current) {
                  videoRef.current.currentTime = time;
                }
                setCurrentTime(time);
              }}
              className="w-full accent-white h-1.5 bg-zinc-700/60 rounded-lg cursor-pointer"
            />

            <span className="text-sm">{formatRemainingTime(currentTime, duration)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 py-4">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-white cursor-pointer">
                {isPlaying ? <Pause className="size-8" /> : <Play className="size-8" />}
              </button>

              <button onClick={() => skipTime(-10)} className="hover:text-white cursor-pointer">
                <RotateCcw className="size-8" />
              </button>

              <button onClick={() => skipTime(10)} className="hover:text-white cursor-pointer">
                <RotateCw className="size-8" />
              </button>

              <button onClick={toggleMute} className="hover:text-white cursor-pointer">
                {isMuted ? <VolumeX className="size-8 text-red-200" /> : <Volume2 className="size-8" />}
              </button>
            </div>

            <span className="text-lg font-semibold text-zinc-200 truncate">{mediaItem.title}</span>

            <div className="text-zinc-400 flex items-center gap-3">
              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="hover:text-white cursor-pointer">
                <Maximize className="size-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRemainingTime(currentTimeInSeconds: number, durationInSeconds: number): string {
  if (!Number.isFinite(currentTimeInSeconds) || currentTimeInSeconds <= 0) return '00:00';

  const remainingTime = durationInSeconds - currentTimeInSeconds;

  const mins = Math.floor(remainingTime / 60);
  const secs = Math.floor(remainingTime % 60);

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
