import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MapPin, ShieldCheck, Truck, X, LocateFixed, Calendar } from 'lucide-react';

export interface DeliveryEstimate {
  postalCode: string;
  regionLabel: string;
  courierMethod: string;
  minDays: number;
  maxDays: number;
  arrivalWindow: string;
  dispatchNote: string;
}

function addBusinessDays(startDate: Date, businessDays: number): Date {
  const result = new Date(startDate);
  let added = 0;
  while (added < businessDays) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0) {
      added += 1;
    }
  }
  return result;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function calculateDeliveryEstimate(rawCode: string): DeliveryEstimate {
  const cleaned = rawCode.trim().toUpperCase();
  const digits = cleaned.replace(/\D/g, '');
  const now = new Date();
  const dispatchCutOff = now.getHours() < 15;
  const dispatchLead = dispatchCutOff ? 0 : 1;
  const dispatchNote = dispatchCutOff
    ? 'Dispatches today from Mumbai Atelier vault'
    : 'Dispatches next business morning from Mumbai Atelier';

  let regionLabel = 'Standard Domestic Courier';
  let courierMethod = 'Sequel Insured Armored Vault';
  let minTransit = 3;
  let maxTransit = 4;

  if (digits.length === 6) {
    // 6-digit Indian PIN codes
    if (digits.startsWith('400')) {
      regionLabel = `Mumbai Metro (${digits})`;
      courierMethod = 'Dedicated White-Glove Hand Courier';
      minTransit = 1;
      maxTransit = 1;
    } else if (
      ['110', '560', '500', '600', '700', '411', '380'].some((p) => digits.startsWith(p))
    ) {
      regionLabel = `Tier-1 Metro (${digits})`;
      courierMethod = 'Sequel Insured Express Air Vault';
      minTransit = 1;
      maxTransit = 2;
    } else {
      regionLabel = `India Postal (${digits})`;
      courierMethod = 'Sequel Insured Vault Transit';
      minTransit = 3;
      maxTransit = 4;
    }
  } else if (digits.length === 5) {
    // 5-digit US / International ZIP codes
    const firstDigit = digits[0];
    const coastLabel =
      firstDigit === '0' || firstDigit === '1' || firstDigit === '2'
        ? 'US East Coast'
        : firstDigit === '8' || firstDigit === '9'
          ? 'US West Coast'
          : 'United States';
    regionLabel = `${coastLabel} (${digits})`;
    courierMethod = 'Brink’s Global Priority Air Vault';
    minTransit = 4;
    maxTransit = 6;
  } else if (cleaned.length >= 4) {
    regionLabel = `International (${cleaned})`;
    courierMethod = 'DHL Express Insured Jewellery Vault';
    minTransit = 5;
    maxTransit = 7;
  }

  const minDays = dispatchLead + minTransit;
  const maxDays = dispatchLead + maxTransit;
  const minDate = addBusinessDays(now, minDays);
  const maxDate = addBusinessDays(now, maxDays);

  const arrivalWindow =
    minDays === maxDays
      ? formatShortDate(minDate)
      : `${formatShortDate(minDate)} – ${formatShortDate(maxDate)}`;

  return {
    postalCode: cleaned || '400001',
    regionLabel,
    courierMethod,
    minDays,
    maxDays,
    arrivalWindow,
    dispatchNote,
  };
}

export const ShippingAndDelivery: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [modalOpen, setModalOpen] = useState(false);
  const [savedCode, setSavedCode] = useState<string>('400001');
  const [draftCode, setDraftCode] = useState<string>('400001');
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const estimate = useMemo(() => calculateDeliveryEstimate(savedCode), [savedCode]);

  const handleApplyZip = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftCode.trim();
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length < 5 && trimmed.length < 4) {
      setError('Enter a valid 5-digit ZIP code or 6-digit PIN code.');
      return;
    }
    setError(null);
    setSavedCode(trimmed);
    setModalOpen(false);
  };

  const handleUseLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setDraftCode('10001');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        // Derive regional hub code based on coarse latitude/longitude hemisphere
        const { longitude } = pos.coords;
        if (longitude > 65 && longitude < 98) {
          setDraftCode('400001');
        } else if (longitude < -100) {
          setDraftCode('94102');
        } else if (longitude <= -50) {
          setDraftCode('10001');
        } else {
          setDraftCode('SW1A 1AA');
        }
      },
      () => {
        setLocating(false);
        setError('Location access unavailable — enter your ZIP or PIN code below.');
      },
      { timeout: 5000 }
    );
  };

  return (
    <>
      {/* Inline Shipping & Delivery Summary Card */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[#9A9AA6]">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#D6C7AE] shrink-0" />
                <span>Shipping &amp; Delivery</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular text-[#D4D4D8]">{estimate.regionLabel}</span>
            </div>
            <p className="text-[13px] font-medium text-[#F4F4F6] flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>Estimated arrival:</span>
              <span className="font-mono-tabular text-[#D6C7AE]">{estimate.arrivalWindow}</span>
            </p>
            <p className="text-[12px] text-[#9A9AA6]">{estimate.courierMethod}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setDraftCode(savedCode);
              setError(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[42px] text-[12px] font-medium border border-white/[0.12] bg-[#121217] hover:border-[#D6C7AE] text-[#F4F4F6] transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D6C7AE]" />
            <span>Change ZIP</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#9A9AA6]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D6C7AE]" />
            Insured vault transit
          </span>
          <span aria-hidden="true">·</span>
          <span>30-day complimentary exchange</span>
          <span aria-hidden="true">·</span>
          <span>100% Platinum 950 buyback</span>
        </div>
      </div>

      {/* Small ZIP / Postal Code Estimator Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Shipping and Delivery Estimator"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.18 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/75"
            />

            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#101015] border border-white/[0.12] p-5 sm:p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] tracking-[0.08em] uppercase text-[#D6C7AE]">
                    Vault Logistics
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#F4F4F6] mt-0.5">
                    Shipping &amp; Delivery
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close shipping estimator"
                  className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 inline-flex items-center justify-center text-[#A1A1AA] hover:text-[#F4F4F6] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApplyZip} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="zip-estimator-input" className="text-[12px] text-[#A1A1AA]">
                      Enter ZIP or PIN code
                    </label>
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      disabled={locating}
                      className="inline-flex items-center gap-1 text-[11px] text-[#D6C7AE] hover:underline cursor-pointer disabled:opacity-60"
                    >
                      <LocateFixed className="w-3 h-3" />
                      <span>{locating ? 'Locating…' : 'Use current location'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="zip-estimator-input"
                      type="text"
                      maxLength={10}
                      value={draftCode}
                      onChange={(e) => {
                        setDraftCode(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. 400001, 10001, 94102"
                      className="flex-1 min-h-[44px] bg-[#15151B] border border-white/[0.12] focus:border-[#D6C7AE] px-3.5 py-2.5 text-[13px] font-mono-tabular text-[#F4F4F6] placeholder:text-[#71717A] outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 min-h-[44px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Calculate
                    </button>
                  </div>

                  {error && <p className="text-[12px] text-[#E5989B]">{error}</p>}
                </div>

                {/* Quick regional presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#71717A]">Quick presets:</span>
                  {[
                    { label: 'Mumbai 400001', code: '400001' },
                    { label: 'Delhi 110001', code: '110001' },
                    { label: 'New York 10001', code: '10001' },
                    { label: 'San Francisco 94102', code: '94102' },
                  ].map((preset) => (
                    <button
                      key={preset.code}
                      type="button"
                      onClick={() => {
                        setDraftCode(preset.code);
                        setError(null);
                      }}
                      className={`px-2.5 py-1.5 text-[11px] border transition-colors cursor-pointer ${
                        draftCode.trim() === preset.code
                          ? 'border-[#D6C7AE] bg-[#181820] text-[#F4F4F6]'
                          : 'border-white/[0.08] bg-[#131318] text-[#A1A1AA] hover:text-[#F4F4F6]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Live Preview of Estimated Arrival */}
                {(() => {
                  const preview = calculateDeliveryEstimate(draftCode || savedCode);
                  return (
                    <div className="p-4 bg-[#14141A] border border-white/[0.08] space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[12px]">
                        <span className="text-[#9A9AA6]">Estimated Arrival</span>
                        <span className="font-mono-tabular font-medium text-[#D6C7AE] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          {preview.arrivalWindow}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[12px]">
                        <span className="text-[#9A9AA6]">Courier Service</span>
                        <span className="text-[#E4E4E7]">{preview.courierMethod}</span>
                      </div>
                      <p className="text-[11px] text-[#9A9AA6] pt-1.5 border-t border-white/[0.06]">
                        {preview.dispatchNote} · Adult signature required upon delivery.
                      </p>
                    </div>
                  );
                })()}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
