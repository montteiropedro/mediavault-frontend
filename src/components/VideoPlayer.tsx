import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { libraryService } from '@/services/api';
import { usePlatform } from '@/hooks/usePlatform';
import { useFullscreenLandscapeVideo } from '@/hooks/useFullscreenLandscapeVideo';
import { useControlsVisibility } from '@/hooks/useControlsVisibility';
import { useHlsPlayer } from '@/hooks/useHlsPlayer';
import { useHlsSubtitleTrack } from '@/hooks/Tracks/useHlsSubtitleTracks';
import { useVideoPlayerShortcuts } from '@/hooks/useVideoPlayerShortcuts';
import { PlayerControls } from '@/components/Player/PlayerControls';
import { Loading } from '@/components/Loading';
import { Subtitles } from '@/components/Player/subtitles';
import type { Playable } from '@/types';

interface VideoPlayerProps {
  playable: Playable;
}

export function VideoPlayer({ playable }: VideoPlayerProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const initialTime = playable.user_progress_seconds || 0;
  const currentProgressRef = useRef<number>(initialTime);
  const lastSavedTimeRef = useRef<number>(initialTime);

  const navigate = useNavigate();
  const { isMobile, isIOS } = usePlatform();
  const { controlsVisible, showControls, hideControls, onControlsMouseEnter, onControlsMouseLeave } =
    useControlsVisibility(videoRef);

  //===========//
  // HLS setup //
  //===========//

  const { isVideoLoading, setIsVideoLoading, audioTracks, selectedAudio, changeAudio } = useHlsPlayer({
    videoRef,
    playable,
  });

  const { selectedSubtitle, activeSubtitleText, handleSubtitleChange } = useHlsSubtitleTrack({
    videoRef,
  });

  //================//
  // Track metadata //
  //================//

  const handleVideoLoadedMetadata = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
    setIsVideoLoading(false);
  };

  //=========================//
  // Persistence of progress //
  //=========================//

  const saveProgressToBackend = async (time: number) => {
    // Prevents repeated calls for the same time
    if (!playable || Math.abs(time - lastSavedTimeRef.current) < 2) return;

    try {
      lastSavedTimeRef.current = time;
      await libraryService.saveProgress(playable.id, playable.type, time);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const time = Math.floor(videoRef.current.currentTime);

    currentProgressRef.current = time;
    setCurrentTime(time);
  };

  const handleClose = () => {
    if (videoRef.current) {
      const time = Math.floor(videoRef.current.currentTime);
      saveProgressToBackend(time);
    }

    navigate(-1);
  };

  //===================//
  // Playback controls //
  //===================//

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

    setCurrentTime(Math.floor(videoRef.current.currentTime));
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

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }

    setCurrentTime(time);
  };

  useVideoPlayerShortcuts({
    onTogglePlay: togglePlay,
    onSkip: skipTime,
    onToggleMute: toggleMute,
    onToggleFullscreen: toggleFullscreen,
    onClose: handleClose,
  });

  const handleVideoAreaInteraction = () => {
    if (isMobile && !controlsVisible) {
      showControls();
    } else if (isMobile && controlsVisible) {
      hideControls();
    } else if (!isMobile) {
      togglePlay();
    }
  };

  const { enterFullscreenLandscape } = useFullscreenLandscapeVideo(videoContainerRef, handleClose);

  return (
    <div
      ref={videoContainerRef}
      onClick={handleVideoAreaInteraction}
      onMouseMove={showControls}
      className={`relative w-dvw h-dvh bg-black text-zinc-100 flex items-center justify-center overflow-hidden ${isIOS && 'ios-player-safe-area'}`}
    >
      {isVideoLoading && <Loading size="lg" className="absolute inset-0" />}

      <div className="size-full flex items-center justify-center">
        <video
          controls={isIOS}
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
          className="size-full object-contain"
        />

        <Subtitles
          activeCue={activeSubtitleText}
          cueOptions={{
            fontSize: 'md',
            avoidControlsOverlap: controlsVisible,
          }}
          isMobile={isMobile}
        />
      </div>

      {/*Control overlay */}
      {!isIOS && !isVideoLoading && (
        <PlayerControls
          videoRef={videoRef}
          isMobile={isMobile}
          playable={playable}
          controlsVisible={controlsVisible}
          onControlsMouseEnter={onControlsMouseEnter}
          onControlsMouseLeave={onControlsMouseLeave}
          isPlaying={isPlaying}
          isMuted={isMuted}
          currentTime={currentTime}
          duration={duration}
          onClose={handleClose}
          onTogglePlay={togglePlay}
          onSkip={skipTime}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onSeek={handleSeek}
          audioTracks={audioTracks}
          selectedAudio={selectedAudio}
          onAudioChange={changeAudio}
          selectedSubtitle={selectedSubtitle}
          onSubtitleChange={handleSubtitleChange}
        />
      )}
    </div>
  );
}
