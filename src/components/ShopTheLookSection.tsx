'use client';

import React, { useState } from 'react';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { ComplementaryItem, formatINR } from '../data/product';
import { SplitReveal } from './SplitReveal';
import { NextImage } from './NextImage';
import { useProductCatalog } from './ProductCatalogContext';

interface ShopTheLookSectionProps {
  onAddComplementary: (item: ComplementaryItem) => void;
  onOpenCollection: () => void;
}

export const ShopTheLookSection: React.FC<ShopTheLookSectionProps> = ({
  onAddComplementary,
  onOpenCollection,
}) => {
  const PRODUCT_DATA = useProductCatalog();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (item: ComplementaryItem) => {
    onAddComplementary(item);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    window.setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section
      id="shop-the-look"
      className="py-12 sm:py-16 md:py-24 border-b border-white/[0.08] bg-[#09090C]"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-6 mb-8 sm:mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[12px] tracking-[0.08em] text-[#D6C7AE] block">
              Curated Platinum Pairing
            </span>
            <SplitReveal
              as="h2"
              text="Shop the Look"
              className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] font-semibold text-[#F4F4F6]"
            />
            <p className="text-[14px] text-[#A1A1AA] max-w-xl">
              Complementary Platinum 950 pieces designed to echo the Trinity helical tension weave.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCollection}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 min-h-[44px] text-[13px] font-medium border border-white/[0.16] bg-[#101014] hover:border-[#D6C7AE] text-[#F4F4F6] transition-colors w-full sm:w-auto self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer group"
          >
            <span>Shop This Look · View All</span>
            <ArrowRight className="w-4 h-4 text-[#D6C7AE] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4-Column Complementary Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_DATA.complementaryItems.map((item) => {
            const isAdded = !!addedIds[item.id];
            return (
              <article
                key={item.id}
                className="group bg-[#101014] border border-white/[0.08] hover:border-white/[0.2] transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0B0B0E] border-b border-white/[0.06]">
                  {imgErrors[item.id] ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#16161C] to-[#0B0B0F]">
                      <span className="font-display text-lg text-[#F4F4F6]">{item.name}</span>
                      <span className="text-xs text-[#A1A1AA] mt-1">{item.metal}</span>
                    </div>
                  ) : (
                    <NextImage
                      src={item.image}
                      alt={item.alt}
                      fill
                      placeholder="blur"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      onError={() => setImgErrors((p) => ({ ...p, [item.id]: true }))}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                </div>

                <div className="p-4 sm:p-5 flex flex-col justify-between gap-4 flex-1 min-w-0">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] text-[#9A9AA6]">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{item.sku}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#F4F4F6] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[12px] text-[#A1A1AA]">{item.metal}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/[0.06]">
                    <span className="font-mono-tabular text-[15px] font-medium text-[#F4F4F6]">
                      {formatINR(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(item)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] text-[12px] font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isAdded
                          ? 'bg-[#D6C7AE] border-[#D6C7AE] text-[#08080A]'
                          : 'bg-[#1A1A22] border-white/[0.16] text-[#F4F4F6] hover:border-[#D6C7AE] hover:bg-[#D6C7AE] hover:text-[#08080A]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
