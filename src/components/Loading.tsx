import { LoaderCircle } from 'lucide-react';

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg' | null;
  className?: string;
};

export function Loading({ size, className }: LoadingProps) {
  const getSizeDynamicStyles = () => {
    const dynamicStyles = [];

    switch (size) {
      case 'sm':
        dynamicStyles.push('size-6');
        break;
      case 'md':
        dynamicStyles.push('size-10');
        break;
      case 'lg':
        dynamicStyles.push('size-14');
        break;
    }

    return dynamicStyles.join(' ');
  };

  return (
    <div className={['flex items-center justify-center bg-transparent', className].join(' ')}>
      <LoaderCircle className={['animate-spin', getSizeDynamicStyles()].join(' ')} />
    </div>
  );
}
