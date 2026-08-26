import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { libraryService } from '@/services/api';
import type { EpisodeProps, MovieProps } from '@/types';

export function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as 'movie' | 'episode' | null;
  const isMobile = useIsMobile();

  const [media, setMedia] = useState<MovieProps | EpisodeProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) return;

    setIsLoading(true);

    libraryService
      .getMedia(id, type)
      .then(setMedia)
      .catch(() => setError('Failed to load video'))
      .finally(() => setIsLoading(false));
  }, [type, id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <LoaderCircle size={isMobile ? 48 : 82} className="animate-spin" />
      </div>
    );
  }

  if (error || !media) {
    return <div className="fixed inset-0 bg-black text-white">{error ?? 'Vídeo não encontrado.'}</div>;
  }

  return <VideoPlayer media={media} />;
}
