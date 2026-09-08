type SubtitlesProps = {
  activeCue: string | null;
  cueOptions?: {
    avoidControlsOverlap?: boolean;
    showBackground?: boolean;
    color?: 'white' | 'yellow';
    fontSize?: 'sm' | 'md' | 'lg';
  };
  cueClassName?: string;
  isMobile: boolean;
};

export function Subtitles({ activeCue, cueOptions, cueClassName, isMobile }: SubtitlesProps) {
  const getCueDynamicStyles = () => {
    const dynamicStyles = [];

    if (isMobile) {
      dynamicStyles.push(cueOptions?.avoidControlsOverlap ? 'bottom-20' : 'bottom-6');
    } else {
      dynamicStyles.push(cueOptions?.avoidControlsOverlap ? 'bottom-28' : 'bottom-14');
    }

    if (cueOptions?.showBackground) {
      dynamicStyles.push('bg-primary/50');
    }

    switch (cueOptions?.color) {
      case 'yellow':
        dynamicStyles.push('text-yellow-500');
        break;
      case 'white':
      default:
        dynamicStyles.push('text-white');
    }

    switch (cueOptions?.fontSize) {
      case 'sm':
        dynamicStyles.push(isMobile ? 'text-sm' : 'text-2xl');
        break;
      case 'lg':
        dynamicStyles.push(isMobile ? 'text-lg' : 'text-4xl');
        break;
      case 'md':
      default:
        dynamicStyles.push(isMobile ? 'text-base' : 'text-3xl');
    }

    return dynamicStyles.join(' ');
  };

  return (
    <span
      className={[
        'absolute z-10 left-1/2 -translate-x-1/2 max-w-[85%] pointer-events-none text-center text-outline font-bold inline-block whitespace-pre-line py-1 px-2 rounded-sm',
        getCueDynamicStyles(),
        cueClassName,
      ].join(' ')}
    >
      {activeCue}
    </span>
  );
}
