import { useRef, useState } from 'react';
import { Captions } from 'lucide-react';
import { TrackList } from './TrackList';
import type { AudioTrack, SubtitleTrack } from '@/types';

type TrackOptionsProps = {
  isMobile: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;

  audioTracks: AudioTrack[];
  selectedAudio: number;

  subtitleTracks: SubtitleTrack[];
  selectedSubtitle: number | null;

  onAudioChange: (id: number) => void;
  onSubtitleChange: (id: number | null) => void;
};

export function TrackOptions({
  isMobile,
  videoRef,
  audioTracks,
  selectedAudio,
  subtitleTracks,
  selectedSubtitle,
  onAudioChange,
  onSubtitleChange,
}: TrackOptionsProps) {
  const [showMobileGradient, setShowMobileGradient] = useState<boolean>(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const wasPlayingBeforeOpen = useRef(false);

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    setShowMobileGradient(!isAtBottom);
  };

  const openOptions = () => {
    if (videoRef.current) {
      wasPlayingBeforeOpen.current = !videoRef.current.paused;
      videoRef.current.pause();
    }
    setIsOptionsOpen(true);
  };

  const closeOptions = () => {
    setIsOptionsOpen(false);
    if (wasPlayingBeforeOpen.current && videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="group relative">
      <div
        onClick={() => {
          if (isMobile) openOptions();
        }}
        className="flex items-center gap-1"
      >
        <Captions className={`duration-150 ${isMobile ? 'size-5' : 'size-10 group-hover:scale-115'}`} />

        {isMobile && <span>Áudio e Legenda</span>}
      </div>

      {isMobile && isOptionsOpen && (
        <div className="fixed z-50 inset-0 bg-black flex flex-col pl-36 py-4">
          <div className="flex justify-center h-full">
            <TrackList
              kind="audio"
              isMobile={isMobile}
              title="Áudio"
              items={audioTracks}
              selectedTrack={selectedAudio}
              onSelect={onAudioChange}
              onScroll={handleScroll}
            />
            <TrackList
              kind="subtitle"
              isMobile={isMobile}
              title="Legenda"
              items={subtitleTracks}
              selectedTrack={selectedSubtitle}
              onSelect={onSubtitleChange}
              onScroll={handleScroll}
            />
          </div>

          {showMobileGradient && (
            <div className="absolute z-50 inset-x-0 bottom-0 h-30 bg-linear-to-t from-black via-black/80 to-transparent" />
          )}

          <button
            onClick={closeOptions}
            className="absolute z-50 right-15 bottom-8 font-bold text-black bg-white h-10 px-4 rounded"
          >
            Salvar
          </button>
        </div>
      )}

      {!isMobile && (
        <div className="group-hover:flex hidden absolute bottom-full -right-4 pb-4">
          <div className="flex gap-2 bg-secondary p-2 rounded">
            <TrackList
              kind="audio"
              isMobile={isMobile}
              title="Áudio"
              items={audioTracks}
              selectedTrack={selectedAudio}
              onSelect={onAudioChange}
            />
            <TrackList
              kind="subtitle"
              isMobile={isMobile}
              title="Legenda"
              items={subtitleTracks}
              selectedTrack={selectedSubtitle}
              onSelect={onSubtitleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
