import { useEffect, useRef, useState } from 'react';
import { MediaCard } from '@/components/MediaCard';
import { ShowCard } from '@/components/ShowCard';
import { Loading } from '@/components/Loading';
import { libraryService } from '@/services/api';
import { useLibraryScan } from '@/contexts/libraryScan/useLibraryScan';
import { useSearch } from '@/contexts/search/useSearch';
import type { Library } from '@/types';

export function LibraryPage() {
  const [library, setLibrary] = useState<Library>({ movies: [], shows: [] });
  const [loading, setLoading] = useState(false);

  const { searchTerm, setSearchTerm } = useSearch();

  const filteredLibrary = [
    ...library.movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase())),
    ...library.shows.filter((show) => show.title.toLowerCase().includes(searchTerm.toLowerCase())),
  ];

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getAll();
      setLibrary(data);
    } catch (error) {
      console.error('Error retrieving media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const data = await libraryService.getAll();
        setLibrary(data);
      } catch (error) {
        console.error('Error retrieving media:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const { scanJobProgress, scanJobId } = useLibraryScan();
  const lastFetchedJobId = useRef<string | null>(null);

  useEffect(() => {
    if (!scanJobId || lastFetchedJobId.current === scanJobId) return;

    if (scanJobProgress?.status === 'completed') {
      lastFetchedJobId.current = scanJobId;
      fetchLibrary();
    }

    if (scanJobProgress?.status === 'failed') {
      lastFetchedJobId.current = scanJobId;
      console.error('Library scan failed:', scanJobProgress);
    }
  }, [scanJobId, scanJobProgress]);

  return (
    <div className="min-h-dvh w-full max-w-app bg-primary text-zinc-100 font-sans antialiased m-auto">
      <main className="flex flex-col gap-10 py-8 px-4 sm:px-16">
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">
                {searchTerm ? 'Resultados da busca' : 'Sua Coleção'}
              </h2>
              <span className="text-xs font-semibold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                {filteredLibrary.length}
              </span>
            </div>
          </h2>

          {loading ? (
            <Loading size="lg" className="absolute inset-0" />
          ) : filteredLibrary.length === 0 && searchTerm ? (
            <div className="py-16 text-center bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
              <p className="text-zinc-400 font-medium">Nenhuma mídia encontrada para "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs text-red-500 hover:underline cursor-pointer"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-6 gap-x-2 lg:gap-x-4">
              {filteredLibrary.map((item) =>
                item.type === 'movie' ? (
                  <MediaCard key={`movie_${item.id}`} playable={item} />
                ) : (
                  <ShowCard key={`show_${item.id}`} show={item} />
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
