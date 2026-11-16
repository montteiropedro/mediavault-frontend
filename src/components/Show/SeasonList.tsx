import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Season } from '@/types';

interface SeasonListProps {
  seasons: Season[];
  currentSeason: Season;
  setCurrentSeasonId: (seasonId: string) => void;
}

export function SeasonList({ seasons, currentSeason, setCurrentSeasonId }: SeasonListProps) {
  const [showSeasonsList, setShowSeasonsList] = useState(false);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setShowSeasonsList(false);
  };

  return (
    <div onBlur={handleBlur} className="relative z-20">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={showSeasonsList}
        onClick={() => setShowSeasonsList((open) => !open)}
        className="flex h-10 cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <span>Temporada {currentSeason.number}</span>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-200 ${showSeasonsList ? 'rotate-180' : ''}`} />
      </button>

      {showSeasonsList && (
        <div role="listbox" aria-label="Selecionar temporada" className="absolute right-0 top-full mt-2 max-h-64 min-w-full overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl shadow-black/60">
          {seasons.map(({ id, number }) => {
            const isSelected = id === currentSeason.id;
            return (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setCurrentSeasonId(id);
                  setShowSeasonsList(false);
                }}
                className={`flex h-10 w-full cursor-pointer items-center rounded-lg px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${isSelected ? 'bg-red-500/15 text-red-300' : 'text-zinc-300 hover:bg-white/[0.07] hover:text-white'}`}
              >
                Temporada {number}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
