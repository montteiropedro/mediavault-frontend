type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string | React.ReactElement;
  size?: 'sm' | 'md' | 'lg';
  useAccentColor?: boolean;
};

export function Button({ text, size, useAccentColor, disabled, className, ...rest }: ButtonProps) {
  const getSizeDynamicStyles = () => {
    const dynamicStyles = [];

    switch (size) {
      case 'sm':
        dynamicStyles.push('h-8 px-2 text-sm');
        break;
      case 'lg':
        dynamicStyles.push('h-12 px-4 text-lg');
        break;
      case 'md':
      default:
        dynamicStyles.push('h-11 px-3 text-base');
    }

    switch (useAccentColor) {
      case true:
        dynamicStyles.push('bg-accent');
        break;
      case false:
      default:
        dynamicStyles.push('bg-secondary');
    }

    return dynamicStyles.join(' ');
  };

  return (
    <button
      className={[
        'font-bold rounded-lg uppercase transition-all duration-150',
        disabled ? 'cursor-default' : 'cursor-pointer hover:brightness-110',
        getSizeDynamicStyles(),
        className,
      ].join(' ')}
      {...rest}
    >
      {text}
    </button>
  );
}
