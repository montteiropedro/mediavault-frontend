import { Check } from 'lucide-react';
import type { AudioTrack, SubtitleTrack } from '@/types';

type BaseTrackListProps = {
  isMobile: boolean;
  title: string;
  selectedTrack: number | null;
  onScroll?: (e: React.UIEvent<HTMLUListElement>) => void;
};

type TrackListProps =
  | (BaseTrackListProps & { kind: 'subtitle'; items: SubtitleTrack[]; onSelect: (track: number | null) => void })
  | (BaseTrackListProps & { kind: 'audio'; items: AudioTrack[]; onSelect: (track: number) => void });

export function TrackList({ kind, isMobile, title, items, selectedTrack, onSelect, onScroll }: TrackListProps) {
  if (!items || items.length === 0) return;

  return (
    <div className={`flex flex-col items-start ${isMobile ? 'w-full h-full' : 'min-w-96 min-h-96 max-h-96'}`}>
      <span className={`font-bold ${isMobile ? 'px-4 py-6 text-xl' : 'px-10 py-8 text-2xl'}`}>{title}</span>

      <ul
        onScroll={onScroll}
        className={`flex flex-col items-start w-full h-[calc(100%-8px-90px)] custom-scrollbar text-left cursor-pointer overflow-y-auto ${isMobile ? 'text-sm' : 'text-lg'}`}
      >
        {kind === 'subtitle' && (
          <>
            <li
              key={`${kind}-off`}
              onClick={() => onSelect(null)}
              className={`flex gap-4 items-center w-full hover:bg-zinc-400/20 ${
                isMobile ? 'px-4 py-4' : 'px-10 py-8'
              } ${selectedTrack === null ? 'text-white' : 'text-zinc-400'}`}
            >
              <Check className={selectedTrack === null ? 'text-white' : 'text-transparent'} />
              Off
            </li>

            {items.map((item) => {
              const isSelected = selectedTrack === item.id;

              return (
                <li
                  key={`${kind}-${item.id}`}
                  onClick={() => onSelect(item.id)}
                  className={`flex gap-4 items-center w-full hover:bg-zinc-400/20 ${isMobile ? 'px-4 py-4' : 'px-10 py-8'} ${
                    isSelected === null ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  <Check className={isSelected ? 'text-white' : 'text-transparent'} />
                  {item.label}
                </li>
              );
            })}
          </>
        )}

        {kind === 'audio' &&
          items.map((item) => {
            const isSelected = selectedTrack === item.id;

            return (
              <li
                key={`${kind}-${item.id}`}
                onClick={() => onSelect(item.id)}
                className={`flex gap-4 items-center w-full hover:bg-zinc-400/20 ${isMobile ? 'px-4 py-4' : 'px-10 py-8'} ${
                  isSelected === null ? 'text-white' : 'text-zinc-400'
                }`}
              >
                <Check className={isSelected ? 'text-white' : 'text-transparent'} />
                {item.name}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
