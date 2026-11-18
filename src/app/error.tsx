'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[AppErrorBoundary]', error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[#08080A] text-[#F4F4F6] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#101015] border border-white/[0.12] p-6 sm:p-8 text-center space-y-5">
        <div className="inline-flex items-center justify-center w-12 h-12 border border-[#D6C7AE]/40 text-[#D6C7AE]">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.12em] text-[#D6C7AE] block">
            Virelle Platinum Atelier
          </span>
          <h1 className="font-display text-3xl font-semibold text-[#F4F4F6]">
            A Temporary Atelier Interruption
          </h1>
          <p className="text-[13px] leading-[1.65] text-[#A1A1AA]">
            We could not complete loading this gallery view. Your saved bag and favorites remain
            safely preserved.
          </p>
          {error?.digest && (
            <p className="font-mono-tabular text-[11px] text-[#71717A] pt-1">
              Ref: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] border border-white/[0.16] hover:border-[#D6C7AE] text-[#F4F4F6] text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Atelier</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
