import { useEffect, useState } from 'react';
import { MediaCard } from '@/components/MediaCard';
import { Header } from '@/components/Header';
import { ShowCard } from '@/components/ShowCard';
import { libraryService } from '@/services/api';
import type { IPlayable } from '@/types';

export function LibraryPage() {
  const [mediaItems, setMediaItems] = useState<IPlayable>({ movies: [], shows: [] });
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMediaItems = [
    ...mediaItems.movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase())),
    ...mediaItems.shows.filter((show) => show.title.toLowerCase().includes(searchTerm.toLowerCase())),
  ];

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const data = await libraryService.getAll();
      setMediaItems(data);
    } catch (error) {
      console.error('Error retrieving media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await libraryService.getAll();
        setMediaItems(data);
      } catch (error) {
        console.error('Error retrieving media:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleLibraryScan = async () => {
    try {
      setIsScanning(true);
      await libraryService.triggerScan();
      await fetchMediaItems();
    } catch (error) {
      console.error('Error scanning library:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen max-w-app bg-zinc-950 text-zinc-100 font-sans antialiased m-auto">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isScanning={isScanning}
        handleLibraryScan={handleLibraryScan}
      />

      {/* Main */}
      <main className="flex flex-col gap-10 py-8 px-4 sm:px-16">
        {/* Section: Complete collection (or filtered by search) */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">
                {searchTerm ? 'Resultados da busca' : 'Sua Coleção'}
              </h2>
              <span className="text-xs font-semibold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                {filteredMediaItems.length}
              </span>
            </div>
          </h2>

          {loading ? (
            <div className="text-center py-20 text-zinc-500">Carregando mídias...</div>
          ) : filteredMediaItems.length === 0 && searchTerm ? (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-6 gap-x-2 lg:gap-x-4">
              {filteredMediaItems.map((item) =>
                item.type === 'movie' ? (
                  <MediaCard key={`movie_${item.id}`} media={item} />
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
