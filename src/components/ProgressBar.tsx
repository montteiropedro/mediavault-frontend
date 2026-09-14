import { twMerge } from 'tailwind-merge';

type ProgressBarProps = {
  percent: number;
  className?: string;
};

export function ProgressBar({ percent, className }: ProgressBarProps) {
  return (
    <div className={twMerge('bg-secondary overflow-hidden rounded-full h-1 w-full', className)}>
      <div className="bg-accent h-full rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
    </div>
  );
}
