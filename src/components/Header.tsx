import { useRef, useState } from 'react';
import { X, Settings, Search } from 'lucide-react';
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
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-white/[0.06] bg-zinc-950/90 px-5 py-3 backdrop-blur-xl transition-all duration-300 sm:px-10 lg:px-14">
      <div
        className={`uppercase flex gap-2 sm:gap-3 ${isDesktop ? 'text-base sm:text-lg md:text-xl' : 'text-xl justify-center w-full'}`}
      >
        <Logo />
      </div>

      <div className="flex items-center justify-end gap-3">
        {isDesktop && (
          <div className="flex gap-4">
            <div className="relative w-full sm:w-72 lg:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-full border border-white/[0.08] bg-white/[0.04] py-1.5 pl-10 pr-9 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-500 focus:border-red-400/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-red-400/30"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 transition hover:text-zinc-200"
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
            className="relative flex h-10 cursor-pointer items-center gap-4 rounded-lg text-zinc-100"
          >
            <div
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Abrir configurações"
              className={`group flex size-10 items-center justify-center rounded-full transition hover:bg-white/[0.08] ${isSettingsOpen ? 'bg-white/[0.08]' : ''}`}
            >
              <Settings size={20} className="group-hover:rotate-90 transition duration-150" />
            </div>

            {isSettingsOpen && (
              <ul className="absolute right-0 top-12 w-max rounded-xl border border-white/10 bg-zinc-900 p-2 shadow-2xl shadow-black/50">
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
