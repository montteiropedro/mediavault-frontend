import { useEffect, useRef } from 'react';
import { mediaItemsService, type IMediaItem } from '../services/api';

interface VideoModalProps {
  mediaItem: IMediaItem | null;
  onClose: () => void;
  onProgressUpdate: (mediaItemId: number, seconds: number) => void;
}

export function VideoModal({ mediaItem, onClose, onProgressUpdate }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const initialTime = mediaItem?.user_progress_seconds || 0;
  const lastSavedTime = useRef<number>(initialTime);

  const saveProgress = async (mediaItemId: number, currentTime: number) => {
    // Prevents repeated calls for the same time
    if (Math.abs(currentTime - lastSavedTime.current) < 2) return;

    try {
      lastSavedTime.current = currentTime;
      onProgressUpdate(mediaItemId, currentTime);
      await mediaItemsService.saveProgress(mediaItemId, currentTime);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleClose = () => {
    if (videoRef.current && mediaItem) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      saveProgress(mediaItem.id, currentTime);
    }
    onClose();
  };

  useEffect(() => {
    if (!mediaItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaItem]);

  if (!mediaItem) return null;

  const handleLoadedMetadata = () => {
    if (videoRef.current && initialTime > 0) {
      const isCompleted = mediaItem.duration && initialTime / mediaItem.duration >= 0.95;

      if (!isCompleted) {
        videoRef.current.currentTime = initialTime;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !mediaItem) return;

    const currentTime = Math.floor(videoRef.current.currentTime);

    // Automatically saves every 5 seconds of video playback.
    if (currentTime > 0 && currentTime % 5 === 0) {
      saveProgress(mediaItem.id, currentTime);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Close video modal on backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Card modal */}
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-zinc-100 truncate">{mediaItem.title}</h3>
            {mediaItem.year && (
              <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                {mediaItem.year}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Video player area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {mediaItem.video_url ? (
            <video
              ref={videoRef}
              src={mediaItem.video_url}
              controls
              autoPlay
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPause={() => {
                if (videoRef.current) {
                  saveProgress(mediaItem.id, Math.floor(videoRef.current.currentTime));
                }
              }}
              className="w-full h-full object-contain"
            >
              Seu navegador não suporta a execução deste formato de vídeo.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-500 gap-2 p-8 text-center">
              <span className="text-4xl">⚠️</span>
              <p className="text-sm font-medium text-zinc-300">URL de vídeo indisponível para esta mídia</p>
              <p className="text-xs text-zinc-500">Caminho do arquivo: {mediaItem.file_path}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
