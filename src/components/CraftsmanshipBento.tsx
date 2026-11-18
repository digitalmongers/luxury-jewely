import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCT_DATA } from '../data/product';
import { SplitReveal } from './SplitReveal';

gsap.registerPlugin(ScrollTrigger);

export const CraftsmanshipBento: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const portraitRef = useRef<HTMLImageElement | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('.bento-reveal');
      gsap.fromTo(
        cells,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );

      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { scale: 1.08, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: portraitRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const marqueeLoop = [...PRODUCT_DATA.marqueeItems, ...PRODUCT_DATA.marqueeItems];

  return (
    <section ref={sectionRef} id="craftsmanship" className="border-b border-white/[0.08] bg-[#08080A]">
      {/* Architectural Marquee Strip */}
      <div className="border-b border-white/[0.08] bg-[#0B0B0E] py-3.5 overflow-hidden">
        <div className="flex w-max animate-luxury-marquee">
          {marqueeLoop.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-6 px-6 text-[12px] tracking-[0.06em] text-[#A1A1AA] whitespace-nowrap"
            >
              <span>{item}</span>
              <span aria-hidden="true" className="text-[#D6C7AE]">
                ·
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24">
        <div className="max-w-2xl mb-8 sm:mb-12 space-y-3">
          <span className="text-[12px] tracking-[0.08em] text-[#D6C7AE] block">
            Craftsmanship &amp; Engineering
          </span>
          <SplitReveal
            as="h2"
            text="Forged in Pure Platinum 950 for Enduring Weight and Radiance"
            className="font-display text-[clamp(1.85rem,3vw,2.75rem)] leading-[1.1] font-semibold text-[#F4F4F6]"
          />
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cell 1: Macro Clasp Architecture (2-col span) */}
          <div className="bento-reveal md:col-span-2 bg-[#101014] border border-white/[0.08] overflow-hidden flex flex-col">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#0D0D11]">
              {imgErrors['clasp'] ? (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#A1A1AA]">
                  Macro Hinged Snap Clasp
                </div>
              ) : (
                <img
                  src={PRODUCT_DATA.gallery[2].src}
                  alt={PRODUCT_DATA.gallery[2].alt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgErrors((p) => ({ ...p, clasp: true }))}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent" />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between gap-4 flex-1">
              <div className="space-y-2">
                <span className="text-[12px] text-[#D6C7AE]">01. Tensioned Clasp Mechanics</span>
                <h3 className="font-display text-2xl font-semibold text-[#F4F4F6]">
                  Flush-Seated Click-Top Snap Hinge
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#A1A1AA] max-w-2xl">
                  Each Trinity bali hoop integrates a spring-calibrated Platinum 950 barrel hinge
                  designed to snap cleanly without snagging hair or knitwear, tested across 10,000
                  cycles for effortless one-handed wear.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#9A9AA6] font-mono-tabular pt-2 border-t border-white/[0.06]">
                <span>Tolerance ±0.02 mm</span>
                <span aria-hidden="true">·</span>
                <span>0.12 ct EF-VVS Bezel Accents</span>
              </div>
            </div>
          </div>

          {/* Cell 2: Tall Editorial Ear Profile (1-col, 2-row span on desktop) */}
          <div className="bento-reveal md:row-span-2 bg-[#101014] border border-white/[0.08] overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] sm:aspect-[3/4] md:aspect-auto md:flex-1 md:min-h-[340px] overflow-hidden bg-[#0D0D11]">
              {imgErrors['editorial'] ? (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#A1A1AA]">
                  Editorial Ear Profile
                </div>
              ) : (
                <img
                  ref={portraitRef}
                  src={PRODUCT_DATA.gallery[1].src}
                  alt={PRODUCT_DATA.gallery[1].alt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgErrors((p) => ({ ...p, editorial: true }))}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#101014] to-transparent" />
            </div>
            <div className="p-6 md:p-8 space-y-3">
              <span className="text-[12px] text-[#D6C7AE]">02. Balanced Proportions</span>
              <h3 className="font-display text-2xl font-semibold text-[#F4F4F6]">
                Day-to-Evening Architectural Drape
              </h3>
              <p className="text-[14px] leading-[1.65] text-[#A1A1AA]">
                Three intertwined strands catch ambient light from every angle while distributing
                platinum&apos;s natural density evenly across the lobe.
              </p>
            </div>
          </div>

          {/* Cell 3: Purity & Metallurgy Telemetry */}
          <div className="bento-reveal bg-[#101014] border border-white/[0.08] p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[12px] text-[#D6C7AE]">03. PGI &amp; BIS Assay</span>
              <h3 className="font-display text-2xl font-semibold text-[#F4F4F6]">
                Naturally White. Never Plated.
              </h3>
              <p className="text-[14px] leading-[1.65] text-[#A1A1AA]">
                Unlike white gold that relies on rhodium plating, 95% pure platinum retains its cool
                luminance for generations and remains completely hypoallergenic.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
              <div>
                <span className="font-mono-tabular text-2xl font-medium text-[#F4F4F6] block">
                  95.0%
                </span>
                <span className="text-[12px] text-[#9A9AA6]">Pure Platinum</span>
              </div>
              <div>
                <span className="font-mono-tabular text-2xl font-medium text-[#F4F4F6] block">
                  21.45
                </span>
                <span className="text-[12px] text-[#9A9AA6]">g/cm³ Density</span>
              </div>
            </div>
          </div>

          {/* Cell 4: Suede Vault Presentation */}
          <div className="bento-reveal bg-[#101014] border border-white/[0.08] overflow-hidden flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#0D0D11]">
              {imgErrors['tray'] ? (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#A1A1AA]">
                  Suede Travel Vault Presentation
                </div>
              ) : (
                <img
                  src={PRODUCT_DATA.gallery[3].src}
                  alt={PRODUCT_DATA.gallery[3].alt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgErrors((p) => ({ ...p, tray: true }))}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent" />
            </div>
            <div className="p-6 md:p-8 space-y-2">
              <span className="text-[12px] text-[#D6C7AE]">04. Heirloom Vault</span>
              <h3 className="font-display text-2xl font-semibold text-[#F4F4F6]">
                Certified Suede Presentation
              </h3>
              <p className="text-[14px] leading-[1.65] text-[#A1A1AA]">
                Delivered sealed with an individually numbered PGI certificate, suede travel tray,
                and lifetime complimentary ultrasonic polishing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
