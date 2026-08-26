import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { ImageOff } from 'lucide-react';
import { useCardEffect } from '@/hooks/useCardEffect';
import type { IEpisode, IMovie } from '@/types';

interface MediaCardProps {
  playable: IMovie | IEpisode;
}

export function MediaCard({ playable }: MediaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { title, duration_seconds, user_progress_seconds } = playable;
  const cover_art_url = 'cover_art_url' in playable ? playable.cover_art_url : null;

  const progressSeconds = user_progress_seconds || 0;
  const progressPercent = duration_seconds > 0 ? Math.min((progressSeconds / duration_seconds) * 100, 100) : 0;
  const isCompleted = progressPercent >= 95;

  const navigate = useNavigate();

  const { handleMouseMove, handleMouseLeave } = useCardEffect({ cardRef });

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/watch/${playable.id}?type=movie`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer select-none flex flex-col"
    >
      <div className="group relative flex flex-col cursor-pointer select-none">
        {/* Cover container */}
        <div className="relative aspect-2/3 w-full rounded-lg bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-all shadow-xl group-hover:shadow-red-950/20">
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
