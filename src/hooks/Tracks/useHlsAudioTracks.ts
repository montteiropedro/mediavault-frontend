import { useCallback, useRef, useState } from 'react';
import Hls from 'hls.js';
import type { AudioTrack } from '@/types';

export function useHlsAudioTracks() {
  const hlsRef = useRef<Hls | null>(null);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<number>(-1);

  const attach = useCallback((hls: Hls) => {
    hlsRef.current = hls;

    const updateTracks = () => {
      setAudioTracks(
        hls.audioTracks.map((track) => ({
          id: track.id,
          name: track.name,
          lang: track.lang,
          default: track.default,
        }))
      );

      setSelectedAudio(hls.audioTrack);
    };

    const handleSwitched = () => setSelectedAudio(hls.audioTrack);

    hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, updateTracks);
    hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, handleSwitched);

    if (hls.audioTracks.length > 0) updateTracks();

    return () => {
      hls.off(Hls.Events.AUDIO_TRACKS_UPDATED, updateTracks);
      hls.off(Hls.Events.AUDIO_TRACK_SWITCHED, handleSwitched);
    };
  }, []);

  const changeAudio = useCallback(
    (trackId: number) => {
      if (!hlsRef.current) return;

      hlsRef.current.audioTrack = trackId;
      setSelectedAudio(trackId);
    },
    [setSelectedAudio]
  );

  return { audioTracks, selectedAudio, changeAudio, attach };
}
