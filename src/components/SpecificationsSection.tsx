'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DiameterOption, FinishOption, PRODUCT_DATA } from '../data/product';

interface SpecificationsSectionProps {
  selectedFinish: FinishOption;
  selectedDiameter: DiameterOption;
  onNavigate: (id: string) => void;
}

export const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({
  selectedFinish,
  selectedDiameter,
  onNavigate,
}) => {
  const dynamicSpecs = [
    ...PRODUCT_DATA.specs,
    { label: 'Selected Finish', value: selectedFinish.name },
    { label: 'Selected Diameter', value: `${selectedDiameter.outerDiameter} (${selectedDiameter.approxWeight})` },
  ];

  return (
    <>
      <section id="specifications" className="py-12 sm:py-16 md:py-24 bg-[#08080A] border-b border-white/[0.08]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[12px] tracking-[0.08em] text-[#D6C7AE] block">
                Technical Dossier
              </span>
              <h2
                className="font-display text-[clamp(1.75rem,2.6vw,2.35rem)] leading-[1.12] font-semibold text-[#F4F4F6]"
                style={{ textWrap: 'balance' }}
              >
                Hallmark &amp; Atelier Specifications
              </h2>
              <p className="text-[14px] leading-[1.65] text-[#A1A1AA]">
                Every pair of Trinity Triumph Platinum Bali Earrings undergoes dual laser assay
                verification and precision weight calibration prior to vault dispatch.
              </p>
            </div>

            <div className="lg:col-span-8">
              <dl className="grid grid-cols-1 sm:grid-cols-2 border-t border-white/[0.08]">
                {dynamicSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="py-4 sm:pr-6 border-b border-white/[0.08] flex flex-col gap-1"
                  >
                    <dt className="text-[12px] text-[#9A9AA6]">{spec.label}</dt>
                    <dd className="font-mono-tabular text-[13px] font-medium text-[#F4F4F6]">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#060608] py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="font-display text-xl font-semibold tracking-[0.06em] text-[#F4F4F6]">
                {PRODUCT_DATA.brand}
              </span>
              <p className="text-[12px] text-[#9A9AA6]">
                Platinum Atelier · Handcrafted in Mumbai · PGI &amp; BIS Certified Fine Jewellery
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#A1A1AA]">
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="py-2 min-h-[40px] hover:text-[#F4F4F6] transition-colors cursor-pointer"
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => onNavigate('atelier-3d')}
                className="py-2 min-h-[40px] hover:text-[#F4F4F6] transition-colors cursor-pointer"
              >
                360° Atelier
              </button>
              <button
                type="button"
                onClick={() => onNavigate('craftsmanship')}
                className="py-2 min-h-[40px] hover:text-[#F4F4F6] transition-colors cursor-pointer"
              >
                Craftsmanship
              </button>
              <button
                type="button"
                onClick={() => onNavigate('shop-the-look')}
                className="py-2 min-h-[40px] hover:text-[#F4F4F6] transition-colors cursor-pointer"
              >
                Shop the Look
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[#9A9AA6]">
            <span>© 2026 {PRODUCT_DATA.brand} Fine Jewellery. All rights reserved.</span>
            <a
              href="https://wa.me/919897266808"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#D6C7AE] hover:text-[#F4F4F6] transition-colors py-1"
            >
              <span>Developed by Digital Mongers Softech</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

