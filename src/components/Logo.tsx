type LogoProps = {
  className?: string;
};

export function Logo({ className = '' }: LogoProps) {
  return (
    <h1 className={['uppercase font-bold tracking-tight text-zinc-100', className].join(' ')}>
      Media<span className="text-accent">Vault</span>
    </h1>
  );
}
