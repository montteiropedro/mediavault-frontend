import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Clapperboard, Play, Tv2 } from 'lucide-react';
import { MediaCard } from '@/components/MediaCard';
import { ShowCard } from '@/components/ShowCard';
import { Loading } from '@/components/Loading';
import { libraryService } from '@/services/api';
import { useLibraryScan } from '@/contexts/libraryScan/useLibraryScan';
import { useSearch } from '@/contexts/search/useSearch';
import type { Library } from '@/types';

function Shelf({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  if (!count) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <span className="text-red-400">{icon}</span>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">{title}</h2>
          <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs font-medium text-zinc-400">{count}</span>
        </div>
        <span className="hidden sm:flex items-center gap-1 text-xs text-zinc-500">
          Explore sua coleção <ArrowRight size={14} />
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pr-2 [scrollbar-thin] [scrollbar-color:#3f3f46_transparent]">
        {children}
      </div>
    </section>
  );
}

export function LibraryPage() {
  const [library, setLibrary] = useState<Library>({ movies: [], shows: [] });
  const [loading, setLoading] = useState(true);
  const { searchTerm, setSearchTerm } = useSearch();

  const filteredMovies = library.movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredShows = library.shows.filter((show) => show.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCount = filteredMovies.length + filteredShows.length;
  const continueWatching = filteredMovies.filter(
    (movie) => movie.user_progress_seconds > 0 && movie.user_progress_seconds / movie.duration_seconds < 0.95
  );

  const fetchLibrary = useCallback(async () => {
    try {
      setLibrary(await libraryService.getAll());
    } catch (error) {
      console.error('Error retrieving media:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchLibrary);
  }, [fetchLibrary]);

  const { scanJobProgress, scanJobId } = useLibraryScan();
  const lastFetchedJobId = useRef<string | null>(null);

  useEffect(() => {
    if (!scanJobId || lastFetchedJobId.current === scanJobId) return;
    if (scanJobProgress?.status === 'completed') {
      lastFetchedJobId.current = scanJobId;
      void Promise.resolve().then(fetchLibrary);
    }
    if (scanJobProgress?.status === 'failed') {
      lastFetchedJobId.current = scanJobId;
      console.error('Library scan failed:', scanJobProgress);
    }
  }, [fetchLibrary, scanJobId, scanJobProgress]);

  return (
    <main className="mx-auto flex w-full max-w-[1800px] flex-col gap-10 px-5 pb-24 pt-7 sm:px-10 sm:pt-10 lg:px-14">
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-linear-to-br from-zinc-900 via-zinc-900 to-red-950/30 px-6 py-7 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="mb-2 text-xl font-semibold uppercase tracking-[0.22em] text-left text-red-400">
              Sua biblioteca pessoal
            </p>
            <p className="mt-2 max-w-xl text-left text-sm text-zinc-400">
              Todos os seus filmes e séries, prontos para continuar de onde parou.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
              <span className="block text-xl font-semibold text-white">{library.movies.length}</span>
              <span className="text-xs text-zinc-500">Filmes</span>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3">
              <span className="block text-xl font-semibold text-white">{library.shows.length}</span>
              <span className="text-xs text-zinc-500">Séries</span>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <Loading size="lg" className="absolute inset-0" />
      ) : searchTerm ? (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">Resultados da busca</h2>
            <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs text-zinc-400">{filteredCount}</span>
          </div>
          {filteredCount === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/50 py-16 text-center">
              <p className="font-medium text-zinc-300">Nenhuma mídia encontrada para “{searchTerm}”</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 cursor-pointer text-sm text-red-400 hover:text-red-300"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {filteredMovies.map((movie) => (
                <MediaCard key={`movie_${movie.id}`} playable={movie} />
              ))}
              {filteredShows.map((show) => (
                <ShowCard key={`show_${show.id}`} show={show} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="flex flex-col gap-9">
          <Shelf
            title="Continuar assistindo"
            count={continueWatching.length}
            icon={<Play size={18} fill="currentColor" />}
          >
            {continueWatching.map((movie) => (
              <div className="w-[42vw] max-w-[210px] min-w-[145px] shrink-0 snap-start sm:w-[190px]" key={movie.id}>
                <MediaCard playable={movie} />
              </div>
            ))}
          </Shelf>
          <Shelf title="Filmes" count={library.movies.length} icon={<Clapperboard size={19} />}>
            {library.movies.map((movie) => (
              <div className="w-[42vw] max-w-[210px] min-w-[145px] shrink-0 snap-start sm:w-[190px]" key={movie.id}>
                <MediaCard playable={movie} />
              </div>
            ))}
          </Shelf>
          <Shelf title="Séries" count={library.shows.length} icon={<Tv2 size={19} />}>
            {library.shows.map((show) => (
              <div className="w-[42vw] max-w-[210px] min-w-[145px] shrink-0 snap-start sm:w-[190px]" key={show.id}>
                <ShowCard show={show} />
              </div>
            ))}
          </Shelf>
          {library.movies.length + library.shows.length === 0 && !loading && (
            <p className="py-12 text-center text-sm text-zinc-500">Sua biblioteca ainda está vazia.</p>
          )}
        </div>
      )}
    </main>
  );
}
