import { useCallback, useEffect, useMemo, useState } from 'react';
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

  const handleCloseDetails = useCallback(() => {
    setSearchParams((params) => {
      params.delete('detail');
      params.delete('season');
      return params;
    });
  }, [setSearchParams]);

  const handleSeasonChange = (seasonId: string) => {
    setSearchParams((params) => {
      params.set('season', seasonId);
      return params;
    });
  };

  useEffect(() => {
    let isActive = true;

    async function loadShow() {
      try {
        const data = await libraryService.getShow(showId);
        if (isActive) setShow(data);
      } catch (error) {
        console.error('Error retrieving show:', error);
      }
    }

    void loadShow();
    return () => {
      isActive = false;
    };
  }, [showId]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleCloseDetails();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCloseDetails]);

  if (!show || !currentSeason) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-zinc-100 backdrop-blur-sm"
        role="status"
        aria-label="Carregando episódios"
      >
        <LoaderCircle size={42} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div
      onClick={handleCloseDetails}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 p-0 text-zinc-100 backdrop-blur-sm sm:p-4 lg:p-8"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="show-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="flex h-100dvh max-h-none w-full max-w-[1480px] flex-col overflow-hidden border border-white/8 bg-zinc-950 shadow-2xl shadow-black/60 sm:h-full sm:max-h-[min(92dvh,1000px)] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.07] bg-zinc-900/70 px-4 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <h2 id="show-modal-title" className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
              {show.title}
            </h2>
            <p className="mt-1 pl-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400 text-left">
              Série
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseDetails}
            aria-label="Fechar episódios"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/4 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/6 px-4 py-4 sm:px-7">
          <div>
            <h3 className="text-base font-semibold text-white sm:text-lg">Episódios</h3>
            <p className="mt-0.5 text-left text-xs text-zinc-500">
              {currentSeason.episodes.length} {currentSeason.episodes.length === 1 ? 'episódio' : 'episódios'}
            </p>
          </div>
          <SeasonList seasons={show.seasons} currentSeason={currentSeason} setCurrentSeasonId={handleSeasonChange} />
        </div>

        <EpisodeGrid episodes={currentSeason.episodes} />
      </section>
    </div>
  );
}
