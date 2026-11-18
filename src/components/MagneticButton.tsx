import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  cursorLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.24,
  cursorLabel,
  className = '',
  onClick,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReduced || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type={rest.type || 'button'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={prefersReduced ? undefined : { x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.5 }}
      whileTap={prefersReduced ? undefined : { scale: 0.985 }}
      data-cursor={cursorLabel}
      className={className}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
};
