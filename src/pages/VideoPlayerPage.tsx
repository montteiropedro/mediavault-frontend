import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { libraryService } from '@/services/api';
import type { Playable } from '@/types';

export function VideoPlayerPage() {
  const { id, type } = useParams<{ id: string; type: 'movie' | 'episode' }>();

  const isMobile = useIsMobile();

  const [playable, setPlayable] = useState<Playable | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;

    const playableType = type;
    const playableId = id;

    async function loadPlayable() {
      try {
        const item = await libraryService.getPlayable(playableId, playableType);

        if (!item.playable || !item.hls_url) {
          setError('This item cannot be played');
          return;
        }

        setPlayable(item);
      } catch {
        setError('Failed to load video');
      }
    }

    loadPlayable();
  }, [type, id]);

  if (!playable && !error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <LoaderCircle size={isMobile ? 48 : 82} className="animate-spin" />
      </div>
    );
  }

  if (error || !playable) {
    return <div className="fixed inset-0 bg-black text-white">{error ?? 'Vídeo não encontrado.'}</div>;
  }

  return <VideoPlayer playable={playable} />;
}
