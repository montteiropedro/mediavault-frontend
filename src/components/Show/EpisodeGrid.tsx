import { Film } from 'lucide-react';
import { EpisodeCard } from './EpisodeCard';
import type { Episode } from '@/types';

interface EpisodeGridProps {
  episodes: Episode[];
}

export function EpisodeGrid({ episodes }: EpisodeGridProps) {
  if (episodes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center text-zinc-500">
        <Film size={32} className="text-zinc-600" />
        <p className="text-sm">Não há episódios nesta temporada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-24 pt-4 custom-scrollbar sm:px-7 sm:pb-8 sm:pt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
        {episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} />)}
      </div>
    </div>
  );
}
