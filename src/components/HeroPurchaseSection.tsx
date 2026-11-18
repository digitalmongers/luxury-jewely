'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Check,
  Heart,
  Video,
  ArrowUpRight,
  Ruler,
} from 'lucide-react';
import {
  DiameterOption,
  FinishOption,
  formatINR,
} from '../data/product';
import { useProductCatalog } from './ProductCatalogContext';
import { AuroraShaderCanvas } from './AuroraShaderCanvas';
import { MagneticButton } from './MagneticButton';
import { SplitReveal } from './SplitReveal';
import { ShippingAndDelivery } from './ShippingAndDelivery';
import { NotifyWhenAvailableForm } from './NotifyWhenAvailableForm';
import { ProductImageGallery } from './ProductImageGallery';
import { SizeGuideModal } from './SizeGuideModal';
import type { DeliveryEstimate } from '@/src/lib/catalog';

interface HeroPurchaseSectionProps {
  selectedFinish: FinishOption;
  onSelectFinish: (finish: FinishOption) => void;
  selectedDiameter: DiameterOption;
  onSelectDiameter: (diameter: DiameterOption) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToBag: () => void;
  onBuyNow: () => void;
  onOpenTryOn: () => void;
  onScrollTo3D: () => void;
  initialDeliveryEstimate?: DeliveryEstimate;
}

export const HeroPurchaseSection: React.FC<HeroPurchaseSectionProps> = ({
  selectedFinish,
  onSelectFinish,
  selectedDiameter,
  onSelectDiameter,
  isWishlisted,
  onToggleWishlist,
  onAddToBag,
  onBuyNow,
  onOpenTryOn,
  onScrollTo3D,
  initialDeliveryEstimate,
}) => {
  const PRODUCT_DATA = useProductCatalog();
  const prefersReduced = useReducedMotion();
  const [justAdded, setJustAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const computedPrice =
    PRODUCT_DATA.basePrice + selectedFinish.priceDelta + selectedDiameter.priceDelta;
  const isInStock = selectedFinish.inStock && selectedDiameter.inStock;
  const restockNote = selectedFinish.restockNote || selectedDiameter.restockNote;

  const handlePrimaryAdd = () => {
    onAddToBag();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <section
      id="overview"
      className="relative overflow-x-clip border-b border-white/[0.08] pt-6 pb-12 sm:pt-8 sm:pb-16 md:pt-10 md:pb-24"
    >
      <AuroraShaderCanvas />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Quiet unboxed breadcrumb metadata */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-[12px] tracking-[0.04em] text-[#A1A1AA] mb-4 sm:mb-6">
          <span>{PRODUCT_DATA.collection}</span>
          <span aria-hidden="true">·</span>
          <span>Platinum 950</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular text-[#D6C7AE]">SKU {PRODUCT_DATA.sku}</span>
          <span aria-hidden="true">·</span>
          <span className={isInStock ? '' : 'text-[#D6C7AE]'}>
            {isInStock ? PRODUCT_DATA.availability : 'Out of Stock · Atelier Waitlist'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          {/* Left 7 columns: Responsive Cloudinary Image Gallery */}
          <div className="lg:col-span-7">
            <ProductImageGallery
              images={PRODUCT_DATA.gallery}
              productTitle={PRODUCT_DATA.title}
              onScrollTo3D={onScrollTo3D}
            />
          </div>

          {/* Right 5 columns: Sticky Contiguous Purchase Module aligned with Left Gallery top */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5 sm:space-y-6">
            <div className="space-y-2.5 border-b border-white/[0.08] pb-5">
              <SplitReveal
                as="h1"
                immediate
                text={PRODUCT_DATA.title}
                className="font-display text-[clamp(2rem,4vw,3.15rem)] leading-[1.04] font-semibold tracking-[-0.015em] text-[#F4F4F6] lg:-mt-1.5"
              />
              <p className="text-[15px] leading-[1.6] text-[#B4B4BE] max-w-xl">
                {PRODUCT_DATA.subtitle}
              </p>

              <div className="pt-3 flex items-baseline justify-between gap-4">
                <div>
                  <span className="font-mono-tabular text-3xl font-medium text-[#F4F4F6] tracking-tight">
                    {formatINR(computedPrice)}
                  </span>
                  <span className="block text-[12px] text-[#9A9AA6] mt-1">
                    Inclusive of all taxes · PGI &amp; BIS hallmarked
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleWishlist}
                  aria-pressed={isWishlisted}
                  aria-label={isWishlisted ? 'Remove from saved favorites' : 'Save to wishlist'}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-[12px] font-medium border transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isWishlisted
                      ? 'border-[#D6C7AE] bg-[#1A1814] text-[#F4F4F6]'
                      : 'border-white/[0.1] bg-[#121216] text-[#D4D4D8] hover:border-[#D6C7AE]/60'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-all duration-200 ${
                      isWishlisted ? 'fill-[#D6C7AE] text-[#D6C7AE] scale-110' : 'text-[#A1A1AA]'
                    }`}
                  />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Finish Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-[13px]">
                <span className="font-medium text-[#E4E4E7]">Metal Finish</span>
                <span className="text-[#D6C7AE] text-right truncate">{selectedFinish.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRODUCT_DATA.finishes.map((finish) => {
                  const active = finish.id === selectedFinish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      onClick={() => onSelectFinish(finish)}
                      className={`px-3.5 py-3 sm:px-3 sm:py-2.5 min-h-[44px] flex sm:block items-center justify-between gap-3 text-left border transition-all duration-200 cursor-pointer ${
                        active
                          ? 'border-[#D6C7AE] bg-[#16161C]'
                          : 'border-white/[0.08] bg-[#101014] hover:border-white/[0.22]'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:mb-1 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full border border-white/25 shrink-0"
                          style={{ backgroundColor: finish.swatchHex }}
                        />
                        <span className="text-[13px] sm:text-[12px] font-medium text-[#F4F4F6] truncate">
                          {finish.shortLabel}
                        </span>
                      </div>
                      <span className="font-mono-tabular text-[11px] text-[#9A9AA6] shrink-0 sm:block">
                        {!finish.inStock
                          ? 'Out of stock'
                          : finish.priceDelta === 0
                            ? 'Standard'
                            : `+${formatINR(finish.priceDelta)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[12px] text-[#9A9AA6]">{selectedFinish.metalNote}</p>
            </div>

            {/* Hoop Diameter Selector */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#E4E4E7]">Bali Silhouette Diameter</span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#D6C7AE] hover:text-[#F4F4F6] underline decoration-[#D6C7AE]/45 underline-offset-4 transition-colors cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Size Guide</span>
                  </button>
                </div>
                <span className="font-mono-tabular text-[12px] text-[#A1A1AA]">
                  Approx. {selectedDiameter.approxWeight}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {PRODUCT_DATA.diameters.map((size) => {
                  const active = size.id === selectedDiameter.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => onSelectDiameter(size)}
                      className={`px-3.5 sm:px-4 py-3 min-h-[44px] flex items-center justify-between gap-2 border transition-all duration-200 cursor-pointer ${
                        active
                          ? 'border-[#D6C7AE] bg-[#16161C]'
                          : 'border-white/[0.08] bg-[#101014] hover:border-white/[0.22]'
                      }`}
                    >
                      <span className="text-[12px] sm:text-[13px] font-medium text-[#F4F4F6] whitespace-nowrap">
                        {size.label}
                      </span>
                      <span className="font-mono-tabular text-[11px] sm:text-[12px] text-[#A1A1AA] shrink-0">
                        {!size.inStock ? 'Waitlist' : size.outerDiameter}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="space-y-3 pt-1">
              {isInStock ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <MagneticButton
                    onClick={handlePrimaryAdd}
                    cursorLabel="Add"
                    className="w-full py-3.5 min-h-[48px] px-3 sm:px-5 bg-[#F4F4F6] hover:bg-white text-[#08080A] text-[13px] sm:text-[14px] font-semibold tracking-wide transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Added</span>
                      </>
                    ) : (
                      <span>Add to Bag</span>
                    )}
                  </MagneticButton>

                  <MagneticButton
                    onClick={onBuyNow}
                    cursorLabel="Buy Now"
                    className="w-full py-3.5 min-h-[48px] px-3 sm:px-5 bg-[#D6C7AE] hover:bg-[#e5d8c2] text-[#08080A] text-[13px] sm:text-[14px] font-semibold tracking-wide transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </MagneticButton>
                </div>
              ) : (
                <NotifyWhenAvailableForm
                  sku={PRODUCT_DATA.sku}
                  productTitle={PRODUCT_DATA.title}
                  variantKey={`${PRODUCT_DATA.sku}-${selectedFinish.id}-${selectedDiameter.id}`}
                  variantLabel={`${selectedFinish.name} · ${selectedDiameter.label}`}
                  restockNote={restockNote}
                />
              )}

              <button
                type="button"
                onClick={onOpenTryOn}
                className="w-full py-3 min-h-[44px] px-4 sm:px-5 border border-white/[0.14] bg-[#101014] hover:border-[#D6C7AE] text-[#E4E4E7] text-[13px] font-medium transition-colors duration-200 flex items-center justify-center gap-2.5 text-center cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#D6C7AE] shrink-0" />
                <span>Book Live Video Try-On with Atelier Stylist</span>
              </button>
            </div>

            {/* Shipping & Delivery Estimator */}
            <ShippingAndDelivery initialEstimate={initialDeliveryEstimate} />
          </div>
        </div>
      </div>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        selectedDiameter={selectedDiameter}
        onSelectDiameter={onSelectDiameter}
      />

      {/* Subtle motion indicator */}
      {!prefersReduced && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="sr-only"
        />
      )}
    </section>
  );
};
