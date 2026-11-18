'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08080A] text-[#F4F4F6] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#101015] border border-white/[0.12] p-8 text-center space-y-5">
          <div className="inline-flex items-center justify-center w-12 h-12 border border-[#D6C7AE]/40 text-[#D6C7AE]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#D6C7AE] block">
              Virelle Fine Jewellery
            </span>
            <h1 className="font-serif text-3xl font-semibold text-[#F4F4F6]">
              Atelier Experience Unavailable
            </h1>
            <p className="text-[13px] text-[#A1A1AA] leading-relaxed">
              Something unexpected occurred at the root layout level. Please reload to restore
              the gallery.
            </p>
            {error?.digest && (
              <p className="font-mono text-[11px] text-[#71717A]">Ref: {error.digest}</p>
            )}
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Atelier</span>
          </button>
        </div>
      </body>
    </html>
  );
}
