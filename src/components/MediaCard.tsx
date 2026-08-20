import { useRef } from 'react';
import { ImageOff } from 'lucide-react';
import type { MediaItemProps } from '../services/api';

interface MediaCardProps {
  mediaItem: MediaItemProps;
  onSelect: (mediaItem: MediaItemProps) => void;
}

export function MediaCard({ mediaItem, onSelect }: MediaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { title, cover_art_url, duration, user_progress_seconds } = mediaItem;

  const progressSeconds = user_progress_seconds || 0;
  const progressPercent = duration && duration > 0 ? Math.min((progressSeconds / duration) * 100, 100) : 0;

  const isCompleted = progressPercent >= 95;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    // Mouse position inside the card (left 0 / right 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Converts (left is now -1 / right is still 1)
    const mouseX = x * 2 - 1;
    const mouseY = y * 2 - 1;

    // Inclination intensity
    const maxRotation = 2;

    const rotateY = mouseX * maxRotation;
    const rotateX = -mouseY * maxRotation;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(mediaItem)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer select-none flex flex-col"
    >
      <div className="group relative flex flex-col gap-2 cursor-pointer select-none">
        {/* Cover container */}
        <div className="relative aspect-2/3 w-full rounded bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-all shadow-lg group-hover:shadow-red-950/20">
          {cover_art_url ? (
            <img src={cover_art_url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold text-xs">
              <ImageOff size={32} />
            </div>
          )}

          {!cover_art_url && (
            <h3 className="absolute bottom-1 sm:bottom-2 px-2 py-0.5 font-medium text-zinc-300 group-hover:text-red-400 group-hover:z-50 backdrop-blur-md w-full text-[10px] sm:text-sm">
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

      {/* Progress Bar */}
      {progressPercent > 0 && !isCompleted && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-secondary overflow-hidden rounded-full h-1 w-[80%]">
          <div className="h-full transition-all duration-300 bg-red-400" style={{ width: `${progressPercent}%` }} />
        </div>
      )}
    </div>
  );
}
