import type { ComponentProps } from 'react';
import { ArrowLeft, Maximize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { TrackOptions } from '@/components/Tracks/TrackOptions';
import type { Playable } from '@/types';

type TrackOptionsProps = ComponentProps<typeof TrackOptions>;

type PlayerControlsProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMobile: boolean;
  playable: Playable;
  controlsVisible: boolean;
  onControlsMouseEnter: () => void;
  onControlsMouseLeave: () => void;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onClose: () => void;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSeek: (time: number) => void;
  bufferedPercent: number;
} & Pick<
  TrackOptionsProps,
  'audioTracks' | 'selectedAudio' | 'onAudioChange' | 'selectedSubtitle' | 'onSubtitleChange'
>;

export function PlayerControls({
  videoRef,
  isMobile,
  playable,
  controlsVisible,
  onControlsMouseEnter,
  onControlsMouseLeave,
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onClose,
  onTogglePlay,
  onSkip,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
  audioTracks,
  selectedAudio,
  onAudioChange,
  selectedSubtitle,
  onSubtitleChange,
  bufferedPercent,
}: PlayerControlsProps) {
  return (
    <div className={`absolute inset-0 flex flex-col justify-between ${controlsVisible ? 'visible' : 'hidden'}`}>
      {/* Top bar controls */}
      <div className="z-10 flex flex-row">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onMouseEnter={onControlsMouseEnter}
          onMouseLeave={onControlsMouseLeave}
          className="flex items-center justify-center rounded-full cursor-pointer p-4"
        >
          <ArrowLeft className={isMobile ? 'size-7' : 'size-10'} />
        </button>
      </div>

      {/* Central controls */}
      {isMobile && (
        <div className="absolute inset-0 flex items-center justify-center gap-16 py-2 px-4">
          <button
            className="px-6"
            onClick={(e) => {
              e.stopPropagation();
              onSkip(-10);
            }}
          >
            <RotateCcw className="size-10" />
          </button>

          <button
            className="px-6"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
          >
            {isPlaying ? <Pause className="size-12" /> : <Play className="size-12" />}
          </button>

          <button
            className="px-6"
            onClick={(e) => {
              e.stopPropagation();
              onSkip(10);
            }}
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
        className="flex flex-col px-4"
      >
        {/* Seekbar/Remaining duration */}
        <div className="relative w-full flex items-center">
          {/* Track background (unfilled) */}
          <div className={`absolute w-full rounded-lg bg-white/20 pointer-events-none ${isMobile ? 'h-0.5' : 'h-1'}`} />

          {/* Buffered range */}
          <div
            className={`absolute rounded-lg bg-white/40 transition-[width] duration-150 pointer-events-none ${isMobile ? 'h-0.5' : 'h-1'}`}
            style={{ width: `${bufferedPercent}%` }}
          />

          {/* Played range */}
          <div
            className={`absolute rounded-lg bg-zinc-100 pointer-events-none ${isMobile ? 'h-0.5' : 'h-1'}`}
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />

          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className={`z-10 w-full appearance-none bg-transparent cursor-pointer video-player-seekbar ${isMobile ? 'h-0.5' : 'h-1'}`}
          />
        </div>

        <div className={`z-10 flex items-center justify-between text-xs ${isMobile ? 'py-5' : 'py-6'}`}>
          <div className="flex gap-10">
            {!isMobile && (
              <>
                <div className="flex items-center gap-4">
                  <button onClick={onTogglePlay} className="cursor-pointer hover:scale-115">
                    {isPlaying ? <Pause className="size-8" /> : <Play className="size-8" />}
                  </button>

                  <button onClick={() => onSkip(-10)} className="cursor-pointer hover:scale-115">
                    <RotateCcw className="size-8" />
                  </button>

                  <button onClick={() => onSkip(10)} className="cursor-pointer hover:scale-115">
                    <RotateCw className="size-8" />
                  </button>

                  <button onClick={onToggleMute} className="cursor-pointer hover:scale-115">
                    {isMuted ? <VolumeX className="size-8 text-red-200" /> : <Volume2 className="size-8" />}
                  </button>
                </div>
              </>
            )}

            {/*{isMobile && (*/}
            <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              <span>
                {formatTime(currentTime)} / {formatRemainingTime(currentTime, duration)}
              </span>
              <span>•</span>
              <span className={`font-bold`}>{playable.title}</span>
            </div>
            {/*)}*/}
          </div>

          <div className="flex items-center gap-4">
            {/* Audio and subtitle selector */}
            <TrackOptions
              isMobile={isMobile}
              videoRef={videoRef}
              audioTracks={audioTracks}
              selectedAudio={selectedAudio}
              onAudioChange={onAudioChange}
              subtitleTracks={playable.subtitle_tracks}
              selectedSubtitle={selectedSubtitle}
              onSubtitleChange={onSubtitleChange}
            />

            {/*Fullscreen */}
            {!isMobile && (
              <button onClick={onToggleFullscreen} className="cursor-pointer hover:scale-115">
                <Maximize className="size-8" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-26 w-full bg-linear-to-t from-black via-black/60 to-transparent" />
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const totalSeconds = Math.max(0, Math.floor(seconds));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function formatRemainingTime(currentTimeInSeconds: number, durationInSeconds: number) {
  const remaining = Math.max(0, durationInSeconds - currentTimeInSeconds);

  return `${formatTime(remaining)}`;
}
