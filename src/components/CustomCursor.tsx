'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [prefersReduced]);

  useEffect(() => {
    if (!isFinePointer || prefersReduced) return;

    let rafId = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setVisible(true);

      const el = (e.target as HTMLElement | null)?.closest('[data-cursor]');
      const nextLabel = el?.getAttribute('data-cursor') || '';
      setLabel(nextLabel);
    };

    const onLeave = () => {
      setVisible(false);
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [isFinePointer, prefersReduced]);

  if (!isFinePointer || prefersReduced) return null;

  const hasLabel = label.length > 0;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-50 pointer-events-none transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-full border transition-all duration-200 ease-out ${
          hasLabel
            ? 'h-14 px-4 min-w-14 bg-[#121216]/90 border-[#D6C7AE]/60 text-[#F4F4F6]'
            : 'w-6 h-6 border-[#E5E7EC]/40 bg-transparent'
        }`}
      >
        {hasLabel ? (
          <span className="text-[11px] font-medium tracking-wider text-[#F4F4F6] whitespace-nowrap">
            {label}
          </span>
        ) : (
          <span className="w-1 h-1 rounded-full bg-[#D6C7AE]" />
        )}
      </div>
    </div>
  );
};
