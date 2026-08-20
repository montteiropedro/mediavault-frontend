import { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isScanning: boolean;
  handleLibraryScan: () => void;
}

export function Header({ searchTerm, setSearchTerm, isScanning, handleLibraryScan }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-primary flex items-center justify-between gap-4 py-4 px-4 sm:px-16">
      <div className="uppercase flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl lg:text-2xl">
        <h1 className="font-bold tracking-tight text-zinc-100">
          Media<span className="text-red-400">Vault</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 focus:border-red-400/50 focus:ring-1 focus:ring-red-400/50 rounded-lg px-4 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition-all pr-8 h-10 w-full"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={handleLibraryScan}
              disabled={isScanning}
              className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors border border-zinc-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 px-4"
            >
              <Settings size={16} />
              <span>{isScanning ? 'Varrendo Biblioteca...' : 'Varrer Biblioteca'}</span>
            </button>
          )}

          {isMobile && (
            <div className="rounded-full fixed z-50 bottom-5 left-1/2 -translate-x-1/2 bg-secondary/80 backdrop-blur-md border border-white/5 flex items-center gap-1 h-14 p-1">
              <button
                onClick={() => {
                  handleLibraryScan();
                }}
                className={[
                  'rounded-full cursor-pointer disabled:opacity-50 text-xs font-bold h-full flex-1 px-2',
                  'active:bg-zinc-400/20 scale-100 active:scale-95 transition-transform duration-300',
                  isSettingsOpen ? 'flex items-center justify-center gap-2 ' : 'hidden',
                ].join(' ')}
              >
                {isScanning ? 'Varrendo Biblioteca...' : 'Varrer Biblioteca'}
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                disabled={isScanning}
                className={[
                  'rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 h-full w-16',
                  'active:bg-zinc-400/20 scale-100 active:scale-95 transition-transform duration-300',
                  isSettingsOpen ? 'bg-zinc-400/20' : '',
                ].join(' ')}
              >
                <Settings size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
