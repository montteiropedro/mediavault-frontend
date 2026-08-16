import { Captions } from 'lucide-react';
import { TrackList } from './TrackList';
import { useRef, useState } from 'react';
import type { IMediaItem } from '../../services/api';

interface TrackOptionsProps {
  mediaItem: IMediaItem;
  isMobile: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  selectedAudioTrackIndex: number | null;
  selectedSubtitleTrackIndex: number | null;
  handleAudioChange: (id: number | null) => void;
  handleSubtitleChange: (id: number | null) => void;
}

export function TrackOptions({
  mediaItem,
  isMobile,
  videoRef,
  selectedAudioTrackIndex,
  selectedSubtitleTrackIndex,
  handleAudioChange,
  handleSubtitleChange,
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
        <Captions className={`duration-150 ${isMobile ? 'size-5' : 'size-8 group-hover:scale-150'}`} />

        {isMobile && <span>Áudio e Legenda</span>}
      </div>

      {isMobile && isOptionsOpen && (
        <div className="fixed z-50 inset-0 bg-black flex flex-col pl-36 py-4">
          <div className="flex justify-center h-full">
            <TrackList
              isMobile={isMobile}
              title="Áudio"
              items={mediaItem.audios}
              selectedId={selectedAudioTrackIndex}
              onSelect={handleAudioChange}
              onScroll={handleScroll}
            />
            <TrackList
              isMobile={isMobile}
              title="Legenda"
              offButton={true}
              items={mediaItem.subtitles}
              selectedId={selectedSubtitleTrackIndex}
              onSelect={handleSubtitleChange}
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
          <div className="flex gap-2 bg-[#262626] p-2 rounded">
            <TrackList
              isMobile={isMobile}
              title="Áudio"
              items={mediaItem.audios}
              selectedId={selectedAudioTrackIndex}
              onSelect={handleAudioChange}
            />
            <TrackList
              isMobile={isMobile}
              title="Legenda"
              offButton={true}
              items={mediaItem.subtitles}
              selectedId={selectedSubtitleTrackIndex}
              onSelect={handleSubtitleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
