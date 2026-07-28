import { ImageOff } from 'lucide-react';
import type { IMediaItem } from '../services/api';

interface MediaCardProps {
  mediaItem: IMediaItem;
  onSelect: (mediaItem: IMediaItem) => void;
}

export function MediaCard({ mediaItem, onSelect }: MediaCardProps) {
  const { title, cover_art_url, year, duration, user_progress_seconds } = mediaItem;

  const progressSeconds = user_progress_seconds || 0;
  const progressPercent = duration && duration > 0 ? Math.min((progressSeconds / duration) * 100, 100) : 0;

  const isCompleted = progressPercent >= 95;
  const isStarted = progressPercent > 0 && !isCompleted;

  return (
    <div onClick={() => onSelect(mediaItem)} className="group relative flex flex-col gap-2 cursor-pointer select-none">
      {/* Cover container (2/3 cover) */}
      <div className="relative aspect-[2/3] w-full rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-all shadow-lg group-hover:shadow-red-950/20">
        {cover_art_url ? (
          <img
            src={cover_art_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold text-xs">
            <ImageOff size={32} />
          </div>
        )}

        {/* "Completed" Badge (Top right) */}
        {isCompleted && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-md shadow-md">
            <span>✓ Concluído</span>
          </div>
        )}

        {/* "In Progress" Badge (Top left) */}
        {isStarted && (
          <div className="absolute top-2 left-2 rounded-md bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-md">
            Em andamento
          </div>
        )}

        {/* Overlay de Hover com ícone Play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Red / Green progress bar */}
        {progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 w-full bg-zinc-950/80">
            <div
              className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-red-600'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Media informations */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-zinc-200 truncate group-hover:text-red-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between text-xs text-zinc-500 mt-0.5">
          {year && <span>{year}</span>}

          {/* Displays remaining time if in progress. */}
          {isStarted && duration && (
            <span className="text-red-400 font-medium text-[11px]">
              Faltam {Math.ceil((duration - progressSeconds) / 60)} min
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
