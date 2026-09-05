import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { libraryService } from '@/services/api';
import type { Playable } from '@/types';

export function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as 'movie' | 'episode' | null;
  const isMobile = useIsMobile();

  const [playable, setPlayable] = useState<Playable | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;

    async function loadInitialData() {
      try {
        const data = await libraryService.getPlayable(id, type);
        setPlayable(data);
      } catch {
        setError('Failed to load video');
      }
    }

    loadInitialData();
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
