import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#08080A] text-[#F4F4F6] px-4 sm:px-6 md:px-10 py-10">
      <div className="max-w-[1400px] mx-auto space-y-10 animate-pulse">
        {/* Top bar skeleton */}
        <div className="h-14 border-b border-white/[0.08] flex items-center justify-between">
          <div className="h-5 w-28 bg-white/[0.08]" />
          <div className="hidden md:flex gap-6">
            <div className="h-4 w-16 bg-white/[0.06]" />
            <div className="h-4 w-20 bg-white/[0.06]" />
            <div className="h-4 w-24 bg-white/[0.06]" />
          </div>
          <div className="h-9 w-20 bg-white/[0.08]" />
        </div>

        {/* Hero 2-column skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-3">
            <div className="aspect-[4/3] bg-[#101015] border border-white/[0.08]" />
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square bg-[#101015] border border-white/[0.08]" />
              <div className="aspect-square bg-[#101015] border border-white/[0.08]" />
              <div className="aspect-square bg-[#101015] border border-white/[0.08]" />
              <div className="aspect-square bg-[#101015] border border-white/[0.08]" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 pt-2">
            <div className="h-3 w-40 bg-[#D6C7AE]/20" />
            <div className="h-12 w-full bg-white/[0.08]" />
            <div className="h-10 w-36 bg-white/[0.08]" />
            <div className="h-20 w-full bg-white/[0.05]" />
            <div className="h-12 w-full bg-white/[0.08]" />
            <div className="h-12 w-full bg-[#D6C7AE]/25" />
          </div>
        </div>
      </div>
    </div>
  );
}
