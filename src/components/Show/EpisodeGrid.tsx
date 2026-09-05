import { EpisodeCard } from './EpisodeCard';
import type { Episode } from '@/types';

interface EpisodeGridProps {
  episodes: Episode[];
}

export function EpisodeGrid({ episodes }: EpisodeGridProps) {
  return (
    <div className="overflow-y-auto pt-4 pb-10 pl-4 md:pl-8 pr-3 md:pr-6 mr-1 custom-scrollbar">
      <div
        className={[
          'grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-y-6 lg:gap-y-12 lg:gap-x-6',
        ].join(' ')}
      >
        {episodes.map((episode: Episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>
    </div>
  );
}
