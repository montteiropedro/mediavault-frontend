import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, LibraryBig, LogOut, Search, User2 } from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import { useLibraryScan } from '@/contexts/libraryScan/useLibraryScan';
import { useAuth } from '@/contexts/auth/useAuth';
import { ProgressBar } from '@/components/ProgressBar';

export function MobileMenu() {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { isScanning: isScanningLibrary, scanJobProgress, handleLibraryScan } = useLibraryScan();
  const { logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  return (
    <div className="z-50 rounded-full fixed bottom-5 left-1/2 -translate-x-1/2 bg-secondary/80 backdrop-blur-md border border-white/5 text-zinc-100 flex items-center gap-1 h-16 w-max p-1">
      <button
        onClick={() => navigate('/')}
        className={twJoin(
          'rounded-full cursor-pointer disabled:opacity-50 font-bold text-[10px] h-full min-w-16 w-max px-4',
          'active:bg-zinc-400/20 scale-100 active:scale-95 transition duration-300',
          isSettingsOpen ? 'hidden' : 'flex flex-col items-center justify-center gap-1'
        )}
      >
        <Home className="size-4" />
        Início
      </button>

      <button
        onClick={() => navigate('/search')}
        className={twJoin(
          'rounded-full cursor-pointer disabled:opacity-50 font-bold text-[10px] h-full min-w-16 w-max px-4',
          'active:bg-zinc-400/20 scale-100 active:scale-95 transition duration-300',
          isSettingsOpen ? 'hidden' : 'flex flex-col items-center justify-center gap-1'
        )}
      >
        <Search className="size-4" />
        Buscar
      </button>

      <button
        onClick={logout}
        className={twJoin(
          'rounded-full cursor-pointer disabled:opacity-50 font-bold text-[10px] h-full min-w-16 w-max px-4',
          'text-danger active:bg-danger/20 scale-100 active:scale-95 transition duration-300',
          isSettingsOpen ? 'flex flex-col items-center justify-center gap-1' : 'hidden'
        )}
      >
        <LogOut className="size-4" />
        Sair
      </button>

      <button
        onClick={() => {
          handleLibraryScan();
        }}
        className={twJoin(
          'rounded-full cursor-pointer disabled:opacity-50 font-bold text-[10px] h-full min-w-16 w-max px-4',
          'active:bg-zinc-400/20 scale-100 active:scale-95 transition duration-300',
          isSettingsOpen ? 'flex flex-col items-center justify-center gap-1' : 'hidden'
        )}
      >
        {isScanningLibrary ? (
          <>
            {isScanningLibrary && <ProgressBar percent={scanJobProgress?.percent ?? 0} className="bg-primary my-1.5" />}
            <div className="flex gap-2">
              <span>Escaneando Biblioteca</span>
              <span className="w-6 text-right">{scanJobProgress?.percent ?? 0}%</span>
            </div>
          </>
        ) : (
          <>
            <LibraryBig className="size-4" />
            Escanear
          </>
        )}
      </button>

      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        disabled={isScanningLibrary}
        className={twJoin(
          'group rounded-full cursor-pointer disabled:opacity-50 font-bold text-[10px] h-full min-w-16 px-4',
          'active:bg-zinc-400/20 scale-100 active:scale-95 transition duration-300',
          'flex flex-col items-center justify-center content-center gap-1',
          isSettingsOpen ? 'bg-zinc-400/20' : ''
        )}
      >
        <User2 className="size-4" />
        Perfil
      </button>
    </div>
  );
}
