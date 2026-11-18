'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  X,
  Ruler,
  Check,
  Sparkles,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { DiameterOption, PRODUCT_DATA, formatINR } from '../data/product';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  selectedDiameter: DiameterOption;
  onSelectDiameter: (diameter: DiameterOption) => void;
}

type PiercingPlacement = 'low' | 'standard' | 'high';

interface SizeSpecDetail {
  id: '14mm' | '18mm';
  outerMm: number;
  innerMm: number;
  gaugeMm: number;
  dropClearanceMm: number;
  profileTitle: string;
  vibe: string;
  fitNotes: string;
  stylingTip: string;
}

const SIZE_SPECS: Record<'14mm' | '18mm', SizeSpecDetail> = {
  '14mm': {
    id: '14mm',
    outerMm: 14.0,
    innerMm: 10.4,
    gaugeMm: 1.8,
    dropClearanceMm: 10.2,
    profileTitle: 'Close-Hugging Atelier Huggie',
    vibe: 'Refined Everyday Precision',
    fitNotes:
      'hugs close to the earlobe contour with a crisp architectural gap—ideal for tailored daywear, silk scarves, and sleeping comfortably.',
    stylingTip:
      'Pairs effortlessly in a primary first piercing alongside an ear cuff or second-lobe stud.',
  },
  '18mm': {
    id: '18mm',
    outerMm: 18.0,
    innerMm: 14.2,
    gaugeMm: 1.9,
    dropClearanceMm: 14.0,
    profileTitle: 'Sculptural Statement Bali',
    vibe: 'Balanced Jawline Presence',
    fitNotes:
      'leaves subtle light beneath the earlobe so the braided three-strand Platinum 950 silhouette catches ambient reflection from every angle.',
    stylingTip:
      'Best suited as a focal primary earring for evening silhouettes or high-set piercings needing extra drop clearance.',
  },
};

const PIERCING_GUIDE: Record<
  PiercingPlacement,
  {
    label: string;
    distance: string;
    recommended: '14mm' | '18mm';
    guidance: string;
  }
> = {
  low: {
    label: 'Low / Delicate Lobe',
    distance: '4–6 mm from bottom edge',
    recommended: '14mm',
    guidance:
      'The 14 mm Classic balanced at 6.42 g keeps center-of-mass tight against the ear with zero downward tug on finer lobes.',
  },
  standard: {
    label: 'Standard Center Lobe',
    distance: '6–8 mm from bottom edge',
    recommended: '14mm',
    guidance:
      'Both silhouettes sit naturally—choose 14 mm for a close huggie drape or 18 mm if you prefer airy daylight beneath the hoop.',
  },
  high: {
    label: 'High / Deep Piercing',
    distance: '8–10+ mm from bottom edge',
    recommended: '18mm',
    guidance:
      'With 14.2 mm inner clearance, the 18 mm Statement clears fuller or higher-set earlobes cleanly without pinching the click-top hinge.',
  },
};

function formatMeasure(mm: number, unit: 'mm' | 'cm'): string {
  if (unit === 'cm') {
    return `${(mm / 10).toFixed(2)} cm`;
  }
  return `${mm.toFixed(1)} mm`;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  open,
  onClose,
  selectedDiameter,
  onSelectDiameter,
}) => {
  const prefersReduced = useReducedMotion();
  const [unit, setUnit] = useState<'mm' | 'cm'>('mm');
  const [previewId, setPreviewId] = useState<'14mm' | '18mm'>(selectedDiameter.id);
  const [piercing, setPiercing] = useState<PiercingPlacement>('standard');

  useEffect(() => {
    if (open) {
      setPreviewId(selectedDiameter.id);
    }
  }, [open, selectedDiameter.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const activeSpec = SIZE_SPECS[previewId];
  const activeOption =
    PRODUCT_DATA.diameters.find((d) => d.id === previewId) ?? PRODUCT_DATA.diameters[0];
  const piercingInfo = PIERCING_GUIDE[piercing];

  const handleApplySize = (id: '14mm' | '18mm') => {
    const found = PRODUCT_DATA.diameters.find((d) => d.id === id);
    if (found) {
      onSelectDiameter(found);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Trinity Triumph Earring Size and Fit Guide"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80"
          />

          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#0E0E12] border border-white/[0.12] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 px-4 py-3.5 sm:px-6 sm:py-5 border-b border-white/[0.08] flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#D6C7AE] inline-flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Virelle Atelier Proportion Guide</span>
                </span>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-[#F4F4F6] leading-tight">
                  Bali Silhouette Size &amp; Fit Guide
                </h2>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {/* Unit Switcher */}
                <div
                  className="inline-flex border border-white/[0.12] bg-[#14141A] p-0.5"
                  role="group"
                  aria-label="Measurement units"
                >
                  {(['mm', 'cm'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1.5 min-h-[34px] text-[11px] font-mono-tabular uppercase transition-colors cursor-pointer ${
                        unit === u
                          ? 'bg-[#D6C7AE] text-[#08080A] font-semibold'
                          : 'text-[#A1A1AA] hover:text-[#F4F4F6]'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close size guide"
                  className="min-w-[44px] min-h-[44px] -mr-2 inline-flex items-center justify-center text-[#A1A1AA] hover:text-[#F4F4F6] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-6">
              {/* Interactive Silhouette Switcher + Scale Schematic */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: Scaled Visual Proportion Comparator */}
                <div className="lg:col-span-5 bg-[#121218] border border-white/[0.08] p-5 flex flex-col justify-between gap-5">
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <span className="text-[#9A9AA6]">True Scale Comparison</span>
                    <span className="font-mono-tabular text-[#D6C7AE]">
                      {formatMeasure(activeSpec.outerMm, unit)} Outer Ø
                    </span>
                  </div>

                  {/* Proportional Concentric Ring Calibration Diagram */}
                  <div className="relative h-52 sm:h-56 flex items-center justify-center bg-[#0A0A0D] border border-white/[0.06] overflow-hidden px-4">
                    {/* Calibrated architectural grid backdrop */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />

                    {/* Side-by-side proportional ring outlines (14mm vs 18mm at 6.5px per mm) */}
                    <div className="relative z-10 flex items-center justify-center gap-6 sm:gap-8">
                      {(['14mm', '18mm'] as const).map((id) => {
                        const spec = SIZE_SPECS[id];
                        const isFocused = previewId === id;
                        const pxSize = Math.round(spec.outerMm * 6.8);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPreviewId(id)}
                            aria-pressed={isFocused}
                            className="group flex flex-col items-center gap-2.5 cursor-pointer focus:outline-none"
                          >
                            <div className="h-32 flex items-center justify-center">
                              <div
                                className={`rounded-full transition-all duration-300 flex items-center justify-center relative ${
                                  isFocused
                                    ? 'border-[7px] border-[#D6C7AE] shadow-[0_0_24px_rgba(214,199,174,0.22)]'
                                    : 'border-[6px] border-white/25 group-hover:border-white/50'
                                }`}
                                style={{
                                  width: `${pxSize}px`,
                                  height: `${pxSize}px`,
                                }}
                              >
                                {/* Inner opening readout */}
                                <span
                                  className={`font-mono-tabular text-[11px] font-medium ${
                                    isFocused ? 'text-[#F4F4F6]' : 'text-[#71717A]'
                                  }`}
                                >
                                  {formatMeasure(spec.innerMm, unit)}
                                </span>
                                {/* Hinged post indicator at top */}
                                <span
                                  aria-hidden="true"
                                  className={`absolute -top-2 w-2.5 h-1.5 rounded-sm ${
                                    isFocused ? 'bg-[#F4F4F6]' : 'bg-white/40'
                                  }`}
                                />
                              </div>
                            </div>
                            <span
                              className={`font-mono-tabular text-[12px] px-2.5 py-1 border transition-colors ${
                                isFocused
                                  ? 'border-[#D6C7AE] bg-[#191922] text-[#F4F4F6]'
                                  : 'border-white/[0.08] text-[#9A9AA6]'
                              }`}
                            >
                              {formatMeasure(spec.outerMm, unit)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#9A9AA6] leading-relaxed">
                    Tap either silhouette above to inspect outer diameter, inner aperture, and lobe
                    drop clearance in real proportion.
                  </p>
                </div>

                {/* Right: Selected Size Dossier & Direct Selector */}
                <div className="lg:col-span-7 bg-[#121218] border border-white/[0.08] p-5 flex flex-col justify-between gap-5">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] uppercase tracking-[0.08em] text-[#D6C7AE]">
                          {activeSpec.vibe}
                        </span>
                        <h3 className="font-display text-2xl font-semibold text-[#F4F4F6]">
                          {activeOption.label} — {activeSpec.profileTitle}
                        </h3>
                      </div>
                      <span className="font-mono-tabular text-sm font-semibold text-[#F4F4F6] bg-[#1A1A22] border border-white/[0.1] px-3 py-1.5">
                        {activeOption.priceDelta === 0
                          ? formatINR(PRODUCT_DATA.basePrice)
                          : `${formatINR(PRODUCT_DATA.basePrice + activeOption.priceDelta)}`}
                      </span>
                    </div>

                    {/* Key Dimensional Grid */}
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      <div className="p-3 bg-[#0B0B0F] border border-white/[0.06]">
                        <dt className="text-[11px] text-[#9A9AA6]">Outer Ø</dt>
                        <dd className="font-mono-tabular text-[14px] font-semibold text-[#F4F4F6] mt-0.5">
                          {formatMeasure(activeSpec.outerMm, unit)}
                        </dd>
                      </div>
                      <div className="p-3 bg-[#0B0B0F] border border-white/[0.06]">
                        <dt className="text-[11px] text-[#9A9AA6]">Inner Opening</dt>
                        <dd className="font-mono-tabular text-[14px] font-semibold text-[#F4F4F6] mt-0.5">
                          {formatMeasure(activeSpec.innerMm, unit)}
                        </dd>
                      </div>
                      <div className="p-3 bg-[#0B0B0F] border border-white/[0.06]">
                        <dt className="text-[11px] text-[#9A9AA6]">Braid Width</dt>
                        <dd className="font-mono-tabular text-[14px] font-semibold text-[#F4F4F6] mt-0.5">
                          {formatMeasure(activeSpec.gaugeMm, unit)}
                        </dd>
                      </div>
                      <div className="p-3 bg-[#0B0B0F] border border-white/[0.06]">
                        <dt className="text-[11px] text-[#9A9AA6]">Pt 950 Pair Wt.</dt>
                        <dd className="font-mono-tabular text-[14px] font-semibold text-[#D6C7AE] mt-0.5">
                          {activeOption.approxWeight}
                        </dd>
                      </div>
                    </dl>

                    <div className="space-y-2.5 text-[13px] leading-[1.65] text-[#C4C4CE]">
                      <p>
                        <span className="text-[#F4F4F6] font-medium">On-Ear Fit:</span>{' '}
                        {activeOption.label} {activeSpec.fitNotes}
                      </p>
                      <p className="text-[#A1A1AA]">
                        <span className="text-[#D6C7AE] font-medium">Styling Note:</span>{' '}
                        {activeSpec.stylingTip}
                      </p>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="text-[12px] text-[#9A9AA6]">
                      Currently selected:{' '}
                      <strong className="text-[#F4F4F6] font-medium">
                        {selectedDiameter.label}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplySize(previewId)}
                      className="px-5 py-2.5 min-h-[44px] bg-[#D6C7AE] hover:bg-[#e5d8c2] text-[#08080A] text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {selectedDiameter.id === previewId ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Keep {activeOption.label}</span>
                        </>
                      ) : (
                        <span>Select {activeOption.label}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Piercing Height Fit Advisor */}
              <div className="bg-[#121218] border border-white/[0.08] p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#D6C7AE] inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Interactive Lobe Fit Advisor</span>
                    </span>
                    <h3 className="font-display text-xl font-semibold text-[#F4F4F6] mt-0.5">
                      Match to Your Piercing Placement
                    </h3>
                  </div>
                  <span className="font-mono-tabular text-[12px] text-[#D6C7AE]">
                    Recommended: {SIZE_SPECS[piercingInfo.recommended].outerMm.toFixed(0)} mm
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['low', 'standard', 'high'] as PiercingPlacement[]).map((key) => {
                    const item = PIERCING_GUIDE[key];
                    const active = piercing === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setPiercing(key);
                          setPreviewId(item.recommended);
                        }}
                        className={`p-3.5 min-h-[44px] text-left border transition-colors cursor-pointer ${
                          active
                            ? 'border-[#D6C7AE] bg-[#181821]'
                            : 'border-white/[0.08] bg-[#0D0D12] hover:border-white/[0.2]'
                        }`}
                      >
                        <span className="text-[13px] font-medium text-[#F4F4F6] block">
                          {item.label}
                        </span>
                        <span className="font-mono-tabular text-[11px] text-[#9A9AA6] block mt-0.5">
                          {item.distance}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3.5 bg-[#0A0A0E] border border-white/[0.06] flex items-start gap-2.5 text-[13px] text-[#D4D4D8] leading-relaxed">
                  <Info className="w-4 h-4 text-[#D6C7AE] shrink-0 mt-0.5" />
                  <p>{piercingInfo.guidance}</p>
                </div>
              </div>

              {/* Side-by-Side Comparison & Fit Tips */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-7 bg-[#121218] border border-white/[0.08] p-4 sm:p-5 overflow-x-auto">
                  <h3 className="text-[13px] font-semibold text-[#F4F4F6] mb-3">
                    Atelier Dimension Comparison
                  </h3>
                  <table className="w-full text-left text-[12px] border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-[#9A9AA6]">
                        <th className="py-2 pr-3 font-normal">Specification</th>
                        <th className="py-2 px-3 font-medium text-[#F4F4F6]">14 mm Classic</th>
                        <th className="py-2 pl-3 font-medium text-[#F4F4F6]">18 mm Statement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      <tr>
                        <td className="py-2.5 pr-3 text-[#9A9AA6]">Outer Diameter</td>
                        <td className="py-2.5 px-3 font-mono-tabular text-[#F4F4F6]">
                          {formatMeasure(14.0, unit)}
                        </td>
                        <td className="py-2.5 pl-3 font-mono-tabular text-[#F4F4F6]">
                          {formatMeasure(18.0, unit)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-3 text-[#9A9AA6]">Inner Clearance</td>
                        <td className="py-2.5 px-3 font-mono-tabular text-[#D4D4D8]">
                          {formatMeasure(10.4, unit)}
                        </td>
                        <td className="py-2.5 pl-3 font-mono-tabular text-[#D4D4D8]">
                          {formatMeasure(14.2, unit)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-3 text-[#9A9AA6]">Helical Profile Width</td>
                        <td className="py-2.5 px-3 font-mono-tabular text-[#D4D4D8]">
                          {formatMeasure(1.8, unit)}
                        </td>
                        <td className="py-2.5 pl-3 font-mono-tabular text-[#D4D4D8]">
                          {formatMeasure(1.9, unit)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-3 text-[#9A9AA6]">Platinum 950 Pair Weight</td>
                        <td className="py-2.5 px-3 font-mono-tabular text-[#D6C7AE]">6.42 g</td>
                        <td className="py-2.5 pl-3 font-mono-tabular text-[#D6C7AE]">7.85 g</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-3 text-[#9A9AA6]">Post Gauge</td>
                        <td className="py-2.5 px-3 font-mono-tabular text-[#D4D4D8]">
                          0.85 mm (20G)
                        </td>
                        <td className="py-2.5 pl-3 font-mono-tabular text-[#D4D4D8]">
                          0.85 mm (20G)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="md:col-span-5 bg-[#121218] border border-white/[0.08] p-4 sm:p-5 space-y-3">
                  <h3 className="text-[13px] font-semibold text-[#F4F4F6] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D6C7AE]" />
                    <span>Fit &amp; Comfort Tips</span>
                  </h3>
                  <ul className="space-y-2.5 text-[12px] leading-[1.6] text-[#B4B4BE]">
                    <li>
                      <strong className="text-[#F4F4F6]">Quick Lobe Measure:</strong> Hold a
                      millimeter ruler vertically from your piercing hole to the base of your ear.
                      Allow +3 mm extra for an airy drop.
                    </li>
                    <li>
                      <strong className="text-[#F4F4F6]">Hypoallergenic 20G Post:</strong> Both
                      sizes share a silk-tapered 0.85 mm Platinum 950 post—compatible with standard
                      piercings.
                    </li>
                    <li>
                      <strong className="text-[#F4F4F6]">30-Day Complimentary Size Exchange:</strong>{' '}
                      Switch effortlessly between 14 mm and 18 mm via insured doorstep pickup.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
