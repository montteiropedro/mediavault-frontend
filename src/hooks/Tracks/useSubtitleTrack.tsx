import { useState, useEffect, useMemo } from 'react';
import type { MediaItemProps } from '../../services/api';

interface useSubtitleTrackProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mediaItem: MediaItemProps;
  baseUrl: string;
}

export const useSubtitleTrack = ({ videoRef, mediaItem, baseUrl }: useSubtitleTrackProps) => {
  const [selectedSubtitleTrackIndex, setSelectedSubtitleTrackIndex] = useState<number | null>(null);
  const [activeSubtitleText, setActiveSubtitleText] = useState<string>('');

  const handleSubtitleChange = (trackIndex: number | null) => {
    setSelectedSubtitleTrackIndex(trackIndex);
    setActiveSubtitleText('');

    if (!videoRef.current) return;

    Array.from(videoRef.current.textTracks).forEach((track, index) => {
      if (trackIndex !== null && index === trackIndex) {
        track.mode = 'hidden';
      } else {
        track.mode = 'disabled';
      }
    });
  };

  const subtitleTracks = useMemo(() => {
    return mediaItem.subtitles.map((subtitle) => (
      <track
        key={subtitle.id}
        kind="subtitles"
        src={`${baseUrl}/api/v1/media_items/${mediaItem.id}/subtitle/${subtitle.id}`}
        srcLang={subtitle.language}
        label={subtitle.label}
      />
    ));
  }, [mediaItem.id, mediaItem.subtitles, baseUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCueChange = () => {
      let activeText = '';

      for (const track of Array.from(video.textTracks)) {
        if (track.mode === 'showing' || track.mode === 'hidden') {
          const cue = track.activeCues?.[0] as VTTCue | undefined;

          if (cue) {
            activeText = cue.text;
            break;
          }
        }
      }

      setActiveSubtitleText(activeText);
    };

    const tracks = Array.from(video.textTracks);
    tracks.forEach((track) => (track.oncuechange = handleCueChange));

    return () => {
      tracks.forEach((track) => (track.oncuechange = null));
    };
  }, [selectedSubtitleTrackIndex, videoRef]);

  return {
    selectedSubtitleTrackIndex,
    activeSubtitleText,
    handleSubtitleChange,
    subtitleTracks,
  };
};
