import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { ImageOff } from 'lucide-react';
import type { IEpisode } from '@/types';

interface EpisodeCardProps {
  episode: IEpisode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { number, title, duration_seconds, user_progress_seconds, thumbnail_url } = episode;

  const progressSeconds = user_progress_seconds || 0;
  const progressPercent = duration_seconds > 0 ? Math.min((progressSeconds / duration_seconds) * 100, 100) : 0;

  const navigate = useNavigate();

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/watch/${episode.id}?type=episode`)}
      className="group z-0 hover:z-30 relative cursor-pointer flex rounded-lg"
    >
      <div className="z-20 group relative flex lg:flex-col items-center gap-4 cursor-pointer w-full">
        {/* Cover container */}
        <div className="aspect-video w-40 sm:w-50 lg:w-full bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-all shadow-lg rounded-lg">
          {thumbnail_url ? (
            <div className="relative size-full">
              <img src={thumbnail_url} alt={title} className="w-full h-full object-cover" />

              <div className="sm:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-50 size-10 sm:size-14 rounded-full border-2 border-zinc-100 text-zinc-100 flex items-center justify-center shadow-2xl drop-shadow-lg">
                <svg className="w-8 h-8 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold text-xs">
              <ImageOff size={32} />
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0 justify-between flex-1 lg:w-full">
          <h3 className="font-bold text-lg lg:text-base text-left">Episódio {number}</h3>

          {/* Progress Bar */}
          <div className="bg-secondary lg:group-hover:bg-black overflow-hidden rounded-full h-1 w-[80%] lg:w-[40%]">
            <div className="h-full transition-all duration-300 bg-red-400" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="hidden sm:flex lg:hidden size-10 sm:size-14 rounded-full bg-zinc-100 text-secondary items-center justify-center shadow-2xl drop-shadow-lg">
          <svg className="w-8 h-8 fill-current ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="lg:block hidden absolute group-hover:z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group-hover:bg-secondary size-full rounded-lg group-hover:scale-y-[1.10] group-hover:scale-x-[1.05]" />
    </div>
  );
}
