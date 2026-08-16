import { Check } from 'lucide-react';

interface TrackListProps {
  isMobile: boolean;
  title: string;
  offButton?: boolean;
  items: {
    id: number;
    language: string;
    label: string;
  }[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onScroll: (e: React.UIEvent<HTMLUListElement>) => void;
}

export function TrackList({ isMobile, title, offButton, items, selectedId, onSelect, onScroll }: TrackListProps) {
  return (
    <div className={`flex flex-col items-start ${isMobile ? 'w-full h-full' : 'min-w-96 min-h-96 max-h-96'}`}>
      <span className={`font-bold ${isMobile ? 'px-4 py-6 text-xl' : 'px-10 py-8 text-2xl'}`}>{title}</span>

      <ul
        onScroll={onScroll}
        className={`flex flex-col items-start w-full h-[calc(100%-8px-90px)] custom-scrollbar text-left cursor-pointer overflow-y-auto ${isMobile ? 'text-sm' : 'text-lg'}`}
      >
        {offButton && (
          <li
            key={items.length + 1}
            onClick={() => onSelect(null)}
            className={`flex gap-4 items-center w-full hover:bg-zinc-400/20 ${isMobile ? 'px-4 py-4' : 'px-10 py-8'} ${
              selectedId === null ? 'text-white' : 'text-zinc-400'
            }`}
          >
            <Check className={selectedId === null ? 'text-white' : 'text-transparent'} />
            Off
          </li>
        )}

        {items.map((item) => {
          const isSelected = selectedId === item.id;

          return (
            <li
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex gap-4 items-center w-full hover:bg-zinc-400/20 ${isMobile ? 'px-4 py-4' : 'px-10 py-8'} ${
                isSelected ? 'text-white' : 'text-zinc-400'
              }`}
            >
              <Check className={isSelected ? 'text-white' : 'text-transparent'} />
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
