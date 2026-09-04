import { useState, useEffect, useCallback } from 'react';

type UseSubtitleTrackProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export const useSubtitleTrack = ({ videoRef }: UseSubtitleTrackProps) => {
  const [selectedSubtitle, setSelectedSubtitle] = useState<number | null>(null);
  const [activeSubtitleText, setActiveSubtitleText] = useState<string>('');

  const handleSubtitleChange = useCallback(
    (trackIndex: number | null) => {
      setSelectedSubtitle(trackIndex);
      setActiveSubtitleText('');

      const video = videoRef.current;
      if (!video) return;

      const tracks = Array.from(video.textTracks).filter((track) => track.kind === 'subtitles');

      tracks.forEach((track, index) => {
        track.mode = trackIndex !== null && index === trackIndex ? 'hidden' : 'disabled';
      });
    },
    [videoRef]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = Array.from(video.textTracks).filter((track) => track.kind === 'subtitles');

    const handleCueChange = () => {
      let activeText = '';

      for (const track of tracks) {
        if (track.mode !== 'hidden') continue;

        const cue = track.activeCues?.[0] as VTTCue | undefined;

        if (cue) {
          activeText = cue.text;
          break;
        }
      }

      setActiveSubtitleText(activeText);
    };

    tracks.forEach((track) => {
      track.addEventListener('cuechange', handleCueChange);
    });

    return () => {
      tracks.forEach((track) => {
        track.removeEventListener('cuechange', handleCueChange);
      });
    };
  }, [selectedSubtitle, videoRef]);

  return {
    selectedSubtitle,
    activeSubtitleText,
    handleSubtitleChange,
  };
};
