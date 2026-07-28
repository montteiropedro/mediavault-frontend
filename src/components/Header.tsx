import { useState, useEffect } from 'react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isScanning: boolean;
  onLibraryScan: () => void;
}

export function Header({ searchTerm, setSearchTerm, isScanning, onLibraryScan }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 px-16 py-4 flex items-center justify-between transition-all duration-300 border-b ${
        isScrolled ? 'border-zinc-800 bg-zinc-900/50 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="flex items-center gap-3 uppercase">
        <div className="size-6 rounded-md bg-red-600 flex items-center justify-center font-black text-md tracking-wider text-white">
          M
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          Media<span className="text-red-500">Vault</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <button
          onClick={onLibraryScan}
          disabled={isScanning}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors border border-zinc-700 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isScanning ? 'Varrendo HD...' : '🔄 Varrer Biblioteca'}
        </button>
      </div>
    </header>
  );
}
