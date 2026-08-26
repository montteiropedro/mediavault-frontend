import { useRef } from 'react';
import { useSearchParams } from 'react-router';
import { ImageOff } from 'lucide-react';
import { ShowModal } from './Show/ShowModal';
import { useCardEffect } from '@/hooks/useCardEffect';
import type { IShow } from '@/types';

interface ShowCardProps {
  show: IShow;
}

export function ShowCard({ show }: ShowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { title, cover_art_url } = show;

  const [searchParams, setSearchParams] = useSearchParams();
  const showModal = searchParams.get('detail') === show.id.toString();

  const handleOpenDetails = () => {
    setSearchParams({ detail: show.id.toString() });
  };

  const { handleMouseMove, handleMouseLeave } = useCardEffect({ cardRef });

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => handleOpenDetails()}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex flex-col cursor-pointer select-none"
      >
        {/* Card container */}
        <div className="relative aspect-2/3 w-full rounded-lg bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-all shadow-lg group-hover:shadow-red-950/20">
          {cover_art_url ? (
            <img src={cover_art_url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold text-xs">
              <ImageOff size={32} />
            </div>
          )}

          {!cover_art_url && (
            <h3 className="absolute bottom-1 sm:bottom-2 px-2 py-0.5 font-medium text-zinc-300 group-hover:text-red-400 group-hover:z-10 backdrop-blur-md w-full text-[10px] sm:text-sm">
              {title}
            </h3>
          )}

          {/* Play Icon Hover Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="size-16 absolute -top-2 -right-2 rounded-bl-4xl bg-red-400 text-white flex items-center justify-center shadow-2xl drop-shadow-lg">
              <svg className="w-8 h-8 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {showModal && <ShowModal showId={show.id} />}
    </>
  );
}
