interface useCardEffectProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const useCardEffect = ({ cardRef }: useCardEffectProps) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    // Mouse position inside the card (left 0 / right 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Converts (left is now -1 / right is still 1)
    const mouseX = x * 2 - 1;
    const mouseY = y * 2 - 1;

    // Inclination intensity
    const maxRotation = 2;

    const rotateY = mouseX * maxRotation;
    const rotateX = -mouseY * maxRotation;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return { handleMouseMove, handleMouseLeave };
};
