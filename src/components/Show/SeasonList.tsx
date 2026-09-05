import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Season } from '@/types';

interface SeasonListProps {
  seasons: Season[];
  currentSeason: Season;
  setCurrentSeasonId: (seasonId: string) => void;
}

export function SeasonList({ seasons, currentSeason, setCurrentSeasonId }: SeasonListProps) {
  const [showSeasonsList, setShowSeasonsList] = useState<boolean>(false);

  const handleSelectSeason = (seasonId: string) => {
    setCurrentSeasonId(seasonId);
    setShowSeasonsList(false);
  };

  return (
    <div onBlur={() => setShowSeasonsList(false)} className="relative z-40 drop-shadow-sm drop-shadow-black rounded-lg">
      <button
        onClick={() => setShowSeasonsList(!showSeasonsList)}
        className={`cursor-pointer bg-secondary border-zinc-600 font-bold flex items-center gap-4 h-11 px-4 rounded-lg ${showSeasonsList ? 'border-x border-t rounded-b-none' : 'border'}`}
      >
        <span>Temporada {currentSeason.number}</span>
        <ChevronDown size={16} className={`transition duration-300 ${showSeasonsList && 'rotate-180'}`} />
      </button>

      {showSeasonsList && (
        <div
          className={`absolute right-0 cursor-pointer border-zinc-600 bg-secondary w-full rounded-b-lg ${showSeasonsList ? 'border-x border-b' : 'border'}`}
        >
          <div className="bg-secondary flex items-center justify-center py-1">
            <div className="bg-zinc-600 w-[80%] h-px rounded-full" />
          </div>

          {seasons.map(({ id, number }) => (
            <div
              key={id}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSeason(id);
              }}
              className={`hover:bg-zinc-400/20 flex items-center gap-2 h-11 px-4 last:rounded-b-lg ${id === currentSeason.id && 'bg-zinc-400/20'}`}
            >
              <span className="font-bold">Temporada {number}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
