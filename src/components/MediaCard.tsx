import { useNavigate } from 'react-router';
import { Film, Play } from 'lucide-react';
import type { Movie } from '@/types';

interface MediaCardProps {
  playable: Movie;
}

export function MediaCard({ playable }: MediaCardProps) {
  const { title, duration_seconds, user_progress_seconds, cover_art_url } = playable;
  const progressPercent = duration_seconds > 0 ? Math.min((user_progress_seconds / duration_seconds) * 100, 100) : 0;
  const isCompleted = progressPercent >= 95;
  const navigate = useNavigate();

  if (!playable.hls_url) return null;

  return (
    <article
      onClick={() => navigate(`/player/${playable.type}/${playable.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') navigate(`/player/${playable.type}/${playable.id}`);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Assistir ${title}`}
      className="group min-w-0 cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950"
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-white/8 bg-zinc-900 shadow-lg shadow-black/20 transition duration-300 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-black/40">
        {cover_art_url ? (
          <img
            src={cover_art_url}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-linear-to-br from-zinc-800 via-zinc-900 to-red-950/60 p-4 text-center">
            <div className="absolute -right-10 -top-10 size-36 rounded-full bg-red-500/10 blur-3xl" />
            <Film size={28} className="relative mb-4 text-red-400/70" />
            <span className="relative line-clamp-4 text-sm font-semibold leading-snug text-zinc-200">{title}</span>
            <span className="relative mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              Filme
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-950/50">
            <Play size={19} fill="currentColor" className="ml-0.5" />
          </span>
        </div>
        {progressPercent > 0 && !isCompleted && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/70">
            <div className="h-full bg-red-500" style={{ width: `${progressPercent}%` }} />
          </div>
        )}
        {isCompleted && (
          <span className="absolute left-2 top-2 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-200 backdrop-blur">
            Assistido
          </span>
        )}
      </div>
      <h3 className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug text-zinc-300 transition-colors group-hover:text-white">
        {title}
      </h3>
      {progressPercent > 0 && !isCompleted && (
        <p className="mt-1 text-xs text-zinc-500">{Math.round(progressPercent)}% assistido</p>
      )}
    </article>
  );
}
