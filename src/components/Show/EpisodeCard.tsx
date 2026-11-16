import { Film, Play } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { Episode } from '@/types';

type EpisodeCardProps = {
  episode: Episode;
};

function formatDuration(seconds: number) {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes.toString().padStart(2, '0')}min` : `${totalMinutes} min`;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const { number, title, duration_seconds, user_progress_seconds, thumbnail_url } = episode;
  const progressPercent = duration_seconds > 0 ? Math.min((user_progress_seconds / duration_seconds) * 100, 100) : 0;
  const isCompleted = progressPercent >= 95;
  const navigate = useNavigate();
  const episodeLabel = `Episódio ${number}`;
  const hasEpisodeTitle = title.trim() && title.toLocaleLowerCase() !== episodeLabel.toLocaleLowerCase();

  const playEpisode = () => navigate(`/player/${episode.type}/${episode.id}`);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Reproduzir ${episodeLabel}${hasEpisodeTitle ? `: ${title}` : ''}`}
      onClick={playEpisode}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          playEpisode();
        }
      }}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.06] bg-zinc-900/60 p-2 text-left transition-colors hover:border-white/[0.12] hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:flex-col sm:items-stretch sm:gap-3 sm:p-3"
    >
      <div className="relative aspect-video w-[38%] min-w-[116px] max-w-[190px] shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-zinc-800 sm:w-full sm:max-w-none">
        {thumbnail_url ? (
          <img src={thumbnail_url} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-red-950/50 text-zinc-500">
            <Film size={26} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-100 transition-opacity sm:bg-black/40 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
          <span className="flex size-9 items-center justify-center rounded-full border border-white/60 bg-black/35 text-white backdrop-blur-sm sm:size-12">
            <Play size={18} fill="currentColor" className="ml-0.5 sm:size-5" />
          </span>
        </div>
        {duration_seconds > 0 && <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">{formatDuration(duration_seconds)}</span>}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 sm:gap-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400">Episódio {number}</p>
          {hasEpisodeTitle && <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">{title}</h3>}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] text-zinc-500">
            <span>{isCompleted ? 'Concluído' : progressPercent > 0 ? `${Math.round(progressPercent)}% assistido` : 'Não iniciado'}</span>
            {progressPercent > 0 && !isCompleted && <span>Continuar</span>}
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-red-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>
    </article>
  );
}
