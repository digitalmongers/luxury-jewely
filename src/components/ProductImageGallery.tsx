'use client';

import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { GalleryImage } from '@/src/data/product';
import { NextImage } from './NextImage';

interface ProductImageGalleryProps {
  images: GalleryImage[];
  productTitle: string;
  onScrollTo3D?: () => void;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productTitle,
  onScrollTo3D,
}) => {
  const prefersReduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const safeCount = images.length;
  const activeImage = images[activeIdx] ?? images[0];

  const selectIndex = useCallback(
    (nextIdx: number) => {
      if (safeCount === 0) return;
      const wrapped = ((nextIdx % safeCount) + safeCount) % safeCount;
      if (wrapped === activeIdx) return;
      setDirection(nextIdx >= activeIdx ? 1 : -1);
      setActiveIdx(wrapped);
      setZoomActive(false);
    },
    [activeIdx, safeCount]
  );

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectIndex(activeIdx - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectIndex(activeIdx + 1);
  };

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || zoomActive) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) {
      selectIndex(activeIdx + 1);
    } else {
      selectIndex(activeIdx - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectIndex(activeIdx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectIndex(activeIdx - 1);
    }
  };

  if (!activeImage) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Responsive Gallery Stage */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${productTitle} gallery`}
        tabIndex={0}
        data-cursor={zoomActive ? 'Magnify' : 'Inspect'}
        onClick={() => setZoomActive((prev) => !prev)}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={() => setZoomActive(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        className="relative w-full aspect-[4/3] bg-[#101014] border border-white/[0.08] overflow-hidden cursor-zoom-in group select-none"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeImage.id}
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 18, scale: 1.015 }
            }
            animate={
              prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }
            }
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -18, scale: 0.99 }
            }
            transition={{ duration: prefersReduced ? 0.15 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {imgErrors[activeImage.id] ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#15151B] to-[#0B0B0E] p-6 sm:p-8 text-center">
                <span className="font-display text-2xl sm:text-3xl text-[#F4F4F6] mb-2">
                  {productTitle}
                </span>
                <span className="text-xs text-[#A1A1AA]">{activeImage.caption}</span>
              </div>
            ) : (
              <NextImage
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                onError={() =>
                  setImgErrors((prev) => ({ ...prev, [activeImage.id]: true }))
                }
                style={
                  zoomActive && !prefersReduced
                    ? {
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        transform: 'scale(1.65)',
                      }
                    : undefined
                }
                className="object-cover transition-transform duration-300 ease-out"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Top-Right Slide Counter */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 pointer-events-none px-2.5 py-1 bg-[#08080A]/75 border border-white/[0.1]">
          <span className="font-mono-tabular text-[11px] text-[#E4E4E7]">
            0{activeIdx + 1} / 0{safeCount}
          </span>
        </div>

        {/* Prev / Next Controls */}
        {safeCount > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous product angle"
              className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center bg-[#08080A]/75 hover:bg-[#08080A] border border-white/[0.14] hover:border-[#D6C7AE] text-[#F4F4F6] sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next product angle"
              className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center bg-[#08080A]/75 hover:bg-[#08080A] border border-white/[0.14] hover:border-[#D6C7AE] text-[#F4F4F6] sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Bottom Scrim + Caption + Zoom Indicator */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3.5 py-3 sm:px-5 sm:py-4 flex items-end justify-between gap-3 pointer-events-none">
          <p className="text-[12px] sm:text-[13px] text-[#E4E4E7] max-w-md line-clamp-2 sm:line-clamp-none">
            {activeImage.caption}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] text-[#D6C7AE] shrink-0 whitespace-nowrap">
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {zoomActive ? 'Click to reset' : 'Click to inspect'}
            </span>
            <span className="sm:hidden">{zoomActive ? 'Reset' : 'Zoom'}</span>
          </span>
        </div>
      </div>

      {/* Responsive Thumbnail Strip (mapped across Cloudinary image URLs + 360° Atelier shortcut) */}
      <div
        className={`grid gap-1.5 sm:gap-3 ${
          onScrollTo3D ? 'grid-cols-5' : 'grid-cols-4'
        }`}
      >
        {images.map((img, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => selectIndex(idx)}
              aria-label={`View gallery angle ${idx + 1}: ${img.caption}`}
              aria-current={isActive ? 'true' : undefined}
              className={`relative aspect-[4/3] min-h-[44px] overflow-hidden border transition-all duration-200 cursor-pointer bg-[#101014] ${
                isActive
                  ? 'border-[#D6C7AE] opacity-100'
                  : 'border-white/[0.08] opacity-60 hover:opacity-95'
              }`}
            >
              {imgErrors[img.id] ? (
                <div className="w-full h-full flex items-center justify-center text-[11px] text-[#A1A1AA]">
                  Angle {idx + 1}
                </div>
              ) : (
                <NextImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 640px) 20vw, 150px"
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [img.id]: true }))
                  }
                  className="object-cover"
                />
              )}
              {isActive && (
                <motion.span
                  layoutId="gallery-thumb-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-[#D6C7AE]"
                  transition={{ duration: prefersReduced ? 0 : 0.25 }}
                />
              )}
            </button>
          );
        })}

        {onScrollTo3D && (
          <button
            type="button"
            onClick={onScrollTo3D}
            data-cursor="360° View"
            className="aspect-[4/3] min-h-[44px] border border-white/[0.12] bg-[#121217] hover:border-[#D6C7AE] transition-colors flex flex-col items-center justify-center gap-0.5 px-1 text-center cursor-pointer group"
          >
            <span className="font-mono-tabular text-[11px] sm:text-xs font-medium text-[#D6C7AE]">
              360°
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#E4E4E7] group-hover:text-white flex items-center gap-0.5 whitespace-nowrap">
              <span className="hidden sm:inline">Atelier</span>
              <span className="sm:hidden">3D</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
