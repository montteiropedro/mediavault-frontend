import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { LoaderCircle, X } from 'lucide-react';
import { EpisodeGrid } from './EpisodeGrid';
import { SeasonList } from './SeasonList';
import { libraryService } from '@/services/api';
import type { Show } from '@/types';

type ShowModalProps = {
  showId: string;
};

export function ShowModal({ showId }: ShowModalProps) {
  const [show, setShow] = useState<Show | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSeasonId = searchParams.get('season');

  const currentSeason = useMemo(() => {
    if (!show?.seasons.length) return null;

    return show.seasons.find((season) => season.id === currentSeasonId) ?? show.seasons[0];
  }, [show, currentSeasonId]);

  const currentEpisodes = currentSeason?.episodes ?? [];

  const handleCloseDetails = () => {
    setSearchParams((params) => {
      params.delete('detail');
      params.delete('season');
      return params;
    });
  };

  const handleSeasonChange = (seasonId: string) => {
    setSearchParams((params) => {
      params.set('season', seasonId);
      return params;
    });
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await libraryService.getShow(showId);
        setShow(data);
      } catch (error) {
        console.error('Error retrieving show:', error);
      }
    }

    loadInitialData();
  }, [showId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleCloseDetails();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!show || !currentSeason) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <LoaderCircle size={82} className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      onClick={() => handleCloseDetails()}
      className="fixed z-40 inset-0 bg-black/80 backdrop-blur-xs shadow-xl w-full overflow-hidden lg:py-10 lg:px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="lg:rounded-lg bg-[#141414] lg:border border-secondary flex flex-col h-full w-full lg:w-[90%] mx-auto overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        <div className="relative flex flex-col items-center gap-4 sm:gap-8 pt-6 sm:pt-10 pb-4 px-4 sm:px-8">
          <div className="flex items-center justify-between w-full">
            <h2 className="font-bold text-xl sm:text-3xl text-left">{show.title}</h2>
            <button
              onClick={() => handleCloseDetails()}
              className="lg:absolute lg:right-4 lg:top-4 p-2 hover:text-zinc-400 flex items-center justify-center rounded-full cursor-pointer"
            >
              <X className="size-6 sm:size-8" />
            </button>
          </div>

          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-lg sm:text-2xl text-left">Episódios</h3>
            <SeasonList seasons={show.seasons} currentSeason={currentSeason} setCurrentSeasonId={handleSeasonChange} />
          </div>
        </div>

        <EpisodeGrid episodes={currentEpisodes} />
      </div>
    </div>
  );
}
