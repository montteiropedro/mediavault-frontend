import { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, LoaderCircle } from 'lucide-react';
import { mediaItemsService, type MediaItemProps } from '../services/api';
import { useFullscreenLandscapeVideo } from '../hooks/useFullscreenLandscapeVideo';
import { useControlsVisibility } from '../hooks/useControlsVisibility';
import { useHlsPlayer } from '../hooks/useHlsPlayer';
import { useAudioTrack } from '../hooks/Tracks/useAudioTrack';
import { useSubtitleTrack } from '../hooks/Tracks/useSubtitleTrack';
import { TrackOptions } from './Tracks/TrackOptions';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface VideoModalProps {
  mediaItem: MediaItemProps;
  onClose: () => void;
  onProgressUpdate: (mediaItemId: number, seconds: number) => void;
}

export function VideoModal({ mediaItem, onClose, onProgressUpdate }: VideoModalProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const initialTime = mediaItem?.user_progress_seconds || 0;
  const currentProgressRef = useRef<number>(initialTime);
  const lastSavedTimeRef = useRef<number>(initialTime);

  //===========//
  // HLS setup //
  //===========//

  const { isVideoLoading, setIsVideoLoading } = useHlsPlayer({
    src: mediaItem.video_url,
    videoRef,
  });

  //================//
  // Track metadata //
  //================//

  const handleVideoLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
    setIsVideoLoading(false);

    const isCompleted = mediaItem?.duration && initialTime / mediaItem.duration >= 0.95;

    if (initialTime > 0 && !isCompleted) {
      videoRef.current.currentTime = initialTime;
    }
  };

  const handleAudioLoadedMetadata = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    audio.currentTime = video.currentTime;
  };

  //=========================//
  // Audio & Subtitle Tracks //
  //=========================//

  const { selectedAudioTrackIndex, isAudioTrackLoading, handleAudioChange } = useAudioTrack({
    videoRef,
    audioRef,
    mediaItemId: mediaItem.id,
    baseUrl: API_BASE_URL,
  });

  const { selectedSubtitleTrackIndex, activeSubtitleText, handleSubtitleChange, subtitleTracks } = useSubtitleTrack({
    videoRef,
    mediaItem: mediaItem,
    baseUrl: API_BASE_URL,
  });

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

  //====================================================================//
  // Navigation & Control functions (+/- 10s, play/pause, fullscreen)   //
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

  const { isMobile, enterFullscreenLandscape } = useFullscreenLandscapeVideo(videoContainerRef, handleClose);
  const { controlsVisible, showControls, hideControls, onControlsMouseEnter, onControlsMouseLeave } =
    useControlsVisibility(videoRef);

  const handleVideoAreaInteraction = () => {
    if (isMobile && !controlsVisible) {
      showControls();
    } else if (isMobile && controlsVisible) {
      hideControls();
    } else if (!isMobile) {
      togglePlay();
    }
  };

  if (!mediaItem) return null;

  return (
    <div
      ref={videoContainerRef}
      onClick={handleVideoAreaInteraction}
      onMouseMove={showControls}
      className="fixed z-50 inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="w-full h-full flex items-center justify-center">
        {(isAudioTrackLoading || isVideoLoading) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <LoaderCircle size={isMobile ? 48 : 82} className="animate-spin" />
          </div>
        )}

        <video
          ref={videoRef}
          crossOrigin="anonymous"
          autoPlay
          onLoadedMetadata={handleVideoLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={enterFullscreenLandscape}
          onPause={() => {
            if (videoRef.current) {
              const time = Math.floor(videoRef.current.currentTime);
              saveProgressToBackend(time);
            }
          }}
          className="w-full h-full object-contain"
        >
          {subtitleTracks}
        </video>

        <audio
          ref={audioRef}
          preload="auto"
          onLoadedMetadata={handleAudioLoadedMetadata}
          className="absolute inset-0 z-50"
        />

        {/* Custom subtitle overlay */}
        {activeSubtitleText && (
          <div
            className={`absolute z-10 left-1/2 -translate-x-1/2 max-w-[85%] text-center pointer-events-none transition-all duration-200 ${isMobile ? (controlsVisible ? 'bottom-20' : 'bottom-6') : controlsVisible ? 'bottom-28' : 'bottom-14'}`}
          >
            <span className="inline-block text-white text-outline font-bold text-base md:text-lg lg:text-4xl px-3 py-1.5 rounded-md whitespace-pre-line">
              {activeSubtitleText}
            </span>
          </div>
        )}
      </div>

      {/* Control overlay */}
      <div className={`absolute inset-0 z-50 flex flex-col justify-between ${controlsVisible ? 'visible' : 'hidden'}`}>
        {/* Top bar controls */}
        <div className="flex flex-row-reverse p-4">
          <button
            onClick={handleClose}
            onMouseEnter={onControlsMouseEnter}
            onMouseLeave={onControlsMouseLeave}
            className="p-2 hover:text-zinc-400 flex items-center justify-center rounded-full cursor-pointer"
          >
            <X className="size-8" />
          </button>
        </div>

        {/* Central controls */}
        {isMobile && !isAudioTrackLoading && (
          <div className="flex items-center justify-center gap-16 py-2 px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                skipTime(-10);
              }}
              className="hover:text-zinc-400 cursor-pointer px-6"
            >
              <RotateCcw className="size-10" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="hover:text-zinc-400 cursor-pointer px-6"
            >
              {isPlaying ? <Pause className="size-12" /> : <Play className="size-12" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                skipTime(10);
              }}
              className="hover:text-zinc-400 cursor-pointer px-6"
            >
              <RotateCw className="size-10" />
            </button>
          </div>
        )}

        {/* Bottom bar controls */}
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={onControlsMouseEnter}
          onMouseLeave={onControlsMouseLeave}
          className="relative flex flex-col p-4"
        >
          {/* Seekbar/Remaining duration */}
          <div className="z-50 flex items-center gap-4">
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
              className={`w-full accent-white rounded-lg cursor-pointer ${isMobile ? 'h-1' : 'h-1.5'}`}
            />

            <span className="text-sm">{formatRemainingTime(currentTime, duration)}</span>
          </div>

          <div
            className={`z-50 flex items-center text-xs ${isMobile ? 'py-2 justify-center' : 'py-4 justify-between'}`}
          >
            {!isMobile && (
              <>
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="hover:text-zinc-400 cursor-pointer">
                    {isPlaying ? <Pause className="size-8" /> : <Play className="size-8" />}
                  </button>

                  <button onClick={() => skipTime(-10)} className="hover:text-zinc-400 cursor-pointer">
                    <RotateCcw className="size-8" />
                  </button>

                  <button onClick={() => skipTime(10)} className="hover:text-zinc-400 cursor-pointer">
                    <RotateCw className="size-8" />
                  </button>

                  <button onClick={toggleMute} className="hover:text-zinc-400 cursor-pointer">
                    {isMuted ? <VolumeX className="size-8 text-red-200" /> : <Volume2 className="size-8" />}
                  </button>
                </div>

                <span className="text-lg font-semibold truncate">{mediaItem.title}</span>
              </>
            )}

            <div className={`flex items-center ${isMobile ? 'gap-12' : 'gap-3'}`}>
              {/* Audio and subtitle selector */}
              <TrackOptions
                mediaItem={mediaItem}
                isMobile={isMobile}
                videoRef={videoRef}
                selectedAudioTrackIndex={selectedAudioTrackIndex}
                selectedSubtitleTrackIndex={selectedSubtitleTrackIndex}
                handleAudioChange={handleAudioChange}
                handleSubtitleChange={handleSubtitleChange}
              />

              {/* Fullscreen */}
              {!isMobile && (
                <button onClick={toggleFullscreen} className="hover:text-zinc-400 cursor-pointer">
                  <Maximize className="size-8" />
                </button>
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-26 w-full bg-linear-to-t from-black via-black/60 to-transparent" />
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
