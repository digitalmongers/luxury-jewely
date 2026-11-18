'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Mail } from 'lucide-react';

interface NotifyWhenAvailableFormProps {
  sku: string;
  productTitle: string;
  variantKey: string;
  variantLabel: string;
  restockNote?: string;
}

const STORAGE_KEY = 'virelle_restock_alerts_v1';

function loadAlerts(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const NotifyWhenAvailableForm: React.FC<NotifyWhenAvailableFormProps> = ({
  sku,
  productTitle,
  variantKey,
  variantLabel,
  restockNote,
}) => {
  const [alertsByVariant, setAlertsByVariant] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAlertsByVariant(loadAlerts());
  }, []);

  const subscribedEmail = alertsByVariant[variantKey] || null;

  useEffect(() => {
    setError(null);
    if (subscribedEmail) {
      setEmail(subscribedEmail);
    } else {
      setEmail('');
    }
  }, [variantKey, subscribedEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    const updated = { ...alertsByVariant, [variantKey]: trimmed };
    setAlertsByVariant(updated);
    setError(null);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors in restricted environments
      }
    }
  };

  const handleReset = () => {
    const next = { ...alertsByVariant };
    delete next[variantKey];
    setAlertsByVariant(next);
    setEmail('');
    setError(null);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
    }
  };

  if (subscribedEmail) {
    return (
      <div
        role="status"
        className="p-4 sm:p-5 bg-[#121217] border border-[#D6C7AE]/45 space-y-2.5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#D6C7AE]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-[13px] font-semibold">Atelier Priority Alert Active</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-[#A1A1AA] hover:text-[#F4F4F6] underline underline-offset-2 cursor-pointer shrink-0"
          >
            Change email
          </button>
        </div>
        <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#D4D4D8]">
          We will notify <span className="text-[#F4F4F6] font-medium break-all">{subscribedEmail}</span>{' '}
          the moment <span className="text-[#D6C7AE]">{variantLabel}</span> ({sku}) returns to the
          vault.
        </p>
        {restockNote && (
          <p className="font-mono-tabular text-[11px] text-[#9A9AA6] pt-1 border-t border-white/[0.06]">
            {restockNote}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={`Email me when ${productTitle} (${variantLabel}) is available`}
      className="p-4 sm:p-5 bg-[#111116] border border-white/[0.12] space-y-3.5"
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#D6C7AE] inline-flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>Currently Out of Stock</span>
          </span>
          {restockNote && (
            <span className="font-mono-tabular text-[11px] text-[#9A9AA6]">{restockNote}</span>
          )}
        </div>
        <p className="text-[12px] sm:text-[13px] text-[#B4B4BE] leading-relaxed">
          Receive a private invitation when <span className="text-[#F4F4F6]">{variantLabel}</span>{' '}
          is crafted and ready for vault dispatch.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Mail
            className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="email"
            required
            aria-label="Email address for restock alert"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="you@domain.com"
            className="w-full min-h-[46px] bg-[#16161C] border border-white/[0.12] focus:border-[#D6C7AE] pl-9 pr-3 py-2.5 text-[13px] text-[#F4F4F6] placeholder:text-[#71717A] outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-4 sm:px-5 py-3 min-h-[46px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[13px] font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Email me when available
        </button>
      </div>

      {error && <p className="text-[12px] text-[#E5989B]">{error}</p>}
    </form>
  );
};
