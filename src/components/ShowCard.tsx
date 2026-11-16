import { Info, Tv2 } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { ShowModal } from './Show/ShowModal';
import type { Show } from '@/types';

type ShowCardProps = { show: Show };

export function ShowCard({ show }: ShowCardProps) {
  const { title, cover_art_url, seasons } = show;
  const [searchParams, setSearchParams] = useSearchParams();
  const showModal = searchParams.get('detail') === show.id.toString();
  const handleOpenDetails = () => setSearchParams({ detail: show.id.toString() });
  const episodeCount = seasons.reduce((count, season) => count + season.episodes.length, 0);

  return (
    <>
      <article
        onClick={handleOpenDetails}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleOpenDetails(); }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes de ${title}`}
        className="group min-w-0 cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900 shadow-lg shadow-black/20 transition duration-300 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-black/40">
          {cover_art_url ? (
            <img src={cover_art_url} alt={title} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-red-950/60 p-4 text-center">
              <div className="absolute -right-10 -top-10 size-36 rounded-full bg-red-500/10 blur-3xl" />
              <div className="relative mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-red-400/80"><Tv2 size={25} /></div>
              <span className="relative line-clamp-4 text-sm font-semibold leading-snug text-zinc-200">{title}</span>
              <span className="relative mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">Série</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="flex size-12 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur"><Info size={18} /></span>
          </div>
        </div>
        <h3 className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug text-zinc-300 transition-colors group-hover:text-white">{title}</h3>
        <p className="mt-1 text-xs text-zinc-500">{seasons.length} {seasons.length === 1 ? 'temporada' : 'temporadas'} · {episodeCount} {episodeCount === 1 ? 'episódio' : 'episódios'}</p>
      </article>
      {showModal && <ShowModal showId={show.id} />}
    </>
  );
}
