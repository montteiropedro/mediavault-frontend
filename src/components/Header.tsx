import { useRef, useState } from 'react';
import { X, Settings } from 'lucide-react';
import { usePlatform } from '../hooks/usePlatform';
import { useAuth } from '@/contexts/auth/useAuth';
import { ProgressBar } from '@/components/ProgressBar';
import { useLibraryScan } from '@/contexts/libraryScan/useLibraryScan';
import { useSearch } from '@/contexts/search/useSearch';
import { Logo } from './Logo';

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { isMobile, isDesktop } = usePlatform();
  const { isScanning, scanJobProgress, handleLibraryScan } = useLibraryScan();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <header className="sticky top-0 z-10 transition-all duration-300 bg-primary flex items-center justify-between gap-4 py-4 px-4 sm:px-16">
      <div
        className={`uppercase flex gap-2 sm:gap-3 ${isDesktop ? 'text-base sm:text-lg md:text-xl lg:text-2xl' : 'text-xl justify-center w-full'}`}
      >
        <Logo />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {isDesktop && (
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
                  aria-label="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {user && !isMobile && (
          <div
            ref={settingsRef}
            onBlur={() => setIsSettingsOpen(false)}
            className="relative flex items-centert text-zinc-100 rounded-lg cursor-pointer gap-4 h-10"
          >
            <div
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`group hover:bg-secondary rounded-lg size-10 flex items-center justify-center ${isSettingsOpen && 'bg-secondary'}`}
            >
              <Settings size={20} className="group-hover:rotate-90 transition duration-150" />
            </div>

            {isSettingsOpen && (
              <ul className="absolute right-0 top-14 bg-secondary rounded-lg w-max p-2">
                <li>
                  <button
                    onClick={handleLibraryScan}
                    disabled={isScanning}
                    className={`relative text-sm font-medium transition-colors rounded-md gap-2 px-4 h-10 w-full ${!isScanning && 'hover:bg-zinc-700 cursor-pointer'}`}
                  >
                    {isScanning ? (
                      <div className="flex flex-col justify-center gap-1 h-max">
                        <div className="flex gap-6">
                          <span>Escaneando Biblioteca</span>
                          <span>{scanJobProgress?.percent ?? 0}%</span>
                        </div>
                        {isScanning && <ProgressBar percent={scanJobProgress?.percent ?? 0} className="bg-primary" />}
                      </div>
                    ) : (
                      'Escanear Biblioteca'
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="flex items-center hover:bg-zinc-700 text-sm font-medium transition-colors rounded-md cursor-pointer gap-2 px-4 h-10 w-full"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
