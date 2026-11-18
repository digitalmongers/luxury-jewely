import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#08080A] text-[#F4F4F6] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-[#101015] border border-white/[0.1] p-8 sm:p-10 text-center space-y-5">
        <span className="font-mono-tabular text-[12px] tracking-[0.14em] uppercase text-[#D6C7AE] block">
          Vault Archive · 404
        </span>
        <h1 className="font-display text-4xl font-semibold text-[#F4F4F6]">
          Piece Not Found in This Salon
        </h1>
        <p className="text-[14px] leading-[1.65] text-[#A1A1AA]">
          The requested Platinum Atelier route is unavailable or has been relocated within our
          collection.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[13px] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Trinity Triumph Balis</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
