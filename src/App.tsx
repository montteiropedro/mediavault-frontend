import { useEffect, useMemo, useState } from 'react';
import { mediaItemsService, type IMediaItem } from './services/api';
import { VideoModal } from './components/VideoModal';
import { MediaCard } from './components/MediaCard';

export function App() {
  const [mediaItems, setMediaItems] = useState<IMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<IMediaItem | null>(null);

  const continueWatchingItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const progressSeconds = item.user_progress_seconds || 0;
      const duration = item.duration || 0;

      if (duration === 0 || progressSeconds === 0) return false;

      const progressPercent = (progressSeconds / duration) * 100;

      return progressPercent > 0 && progressPercent < 95;
    });
  }, [mediaItems]);

  const filteredMediaItems = mediaItems.filter((item) => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const data = await mediaItemsService.getAll();
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
        const data = await mediaItemsService.getAll();
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
      await mediaItemsService.triggerScan();
      await fetchMediaItems();
    } catch (error) {
      console.error('Error scanning library:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleProgressUpdate = (mediaId: number, progressSeconds: number) => {
    setMediaItems((prevItems) =>
      prevItems.map((item) => (item.id === mediaId ? { ...item, user_progress_seconds: progressSeconds } : item))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 uppercase">
          <div className="size-6 rounded-md bg-red-600 flex items-center justify-center font-black text-md tracking-wider text-white">
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Media<span className="text-red-500">Vault</span>
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search field */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 rounded-lg px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all pr-8"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Library scan button */}
          <button
            onClick={handleLibraryScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors border border-zinc-700 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isScanning ? 'Varrendo HD...' : '🔄 Varrer Biblioteca'}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
        {/* Section: Keep watching */}
        {!loading && !searchTerm && continueWatchingItems.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-zinc-100">Continuar Assistindo</h2>
              <span className="text-xs font-semibold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                {continueWatchingItems.length}
              </span>
            </div>

            {/* Keep watching grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {continueWatchingItems.map((item) => (
                <MediaCard
                  key={`continue-${item.id}`}
                  mediaItem={item}
                  onSelect={(selected) => setSelectedMedia(selected)}
                />
              ))}
            </div>
          </section>
        )}

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMediaItems.map((item) => (
                <MediaCard key={item.id} mediaItem={item} onSelect={(selected) => setSelectedMedia(selected)} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Selected video modal */}
      {selectedMedia && (
        <VideoModal
          key={selectedMedia.id}
          mediaItem={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
}

export default App;
