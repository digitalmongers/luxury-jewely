'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionConfig } from 'motion/react';
import {
  CartItem,
  ComplementaryItem,
  DiameterOption,
  FinishOption,
  PRODUCT_DATA,
  formatINR,
} from '@/src/data/product';
import type { ClientReview, DeliveryEstimate } from '@/src/lib/catalog';
import { Navbar } from './Navbar';
import { HeroPurchaseSection } from './HeroPurchaseSection';
import { CraftsmanshipBento } from './CraftsmanshipBento';
import { ShopTheLookSection } from './ShopTheLookSection';
import { CustomerReviews } from './CustomerReviews';
import { SpecificationsSection } from './SpecificationsSection';
import {
  BagDrawer,
  PlatinumCollectionModal,
  TryOnModal,
} from './BagAndTryOnModals';
import { CustomCursor } from './CustomCursor';
import { ErrorBoundary } from './ErrorBoundary';
import {
  ProductCatalogProvider,
  type ProductCatalogData,
} from './ProductCatalogContext';
import { WishlistItem, useWishlist } from '@/src/hooks/useWishlist';

gsap.registerPlugin(ScrollTrigger);

const PlatinumBali3DViewer = dynamic(
  () => import('./PlatinumBali3DViewer').then((mod) => mod.PlatinumBali3DViewer),
  {
    ssr: false,
    loading: () => (
      <section
        id="atelier-3d"
        className="py-16 md:py-24 border-b border-white/[0.08] bg-[#08080A]"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="h-[460px] md:h-[580px] bg-[#0E0E13] border border-white/[0.08] flex flex-col items-center justify-center gap-3 animate-pulse">
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#D6C7AE]">
              Initialising WebGL Platinum Atelier
            </span>
            <span className="font-display text-2xl text-[#F4F4F6]">
              Preparing 360° Sculpture…
            </span>
          </div>
        </div>
      </section>
    ),
  }
);

interface ProductShowcaseClientProps {
  initialProduct?: ProductCatalogData;
  initialReviews?: ClientReview[];
  initialDeliveryEstimate?: DeliveryEstimate;
}

export const ProductShowcaseClient: React.FC<ProductShowcaseClientProps> = ({
  initialProduct,
  initialReviews,
  initialDeliveryEstimate,
}) => {
  const catalog = initialProduct ?? PRODUCT_DATA;
  const lenisRef = useRef<Lenis | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(catalog.finishes[0]);
  const [selectedDiameter, setSelectedDiameter] = useState<DiameterOption>(
    catalog.diameters[0]
  );
  const [bagItems, setBagItems] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [bagInitialStep, setBagInitialStep] = useState<'cart' | 'checkout'>('cart');
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const { favorites, isSaved, toggleFavorite, removeFavorite } = useWishlist(
    'digitalmongers72@gmail.com'
  );

  useEffect(() => {
    const onScroll = () => {
      setShowMobileBar(window.scrollY > 560);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetEl, { offset: -64 });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentPrice =
    catalog.basePrice + selectedFinish.priceDelta + selectedDiameter.priceDelta;
  const isCurrentInStock = selectedFinish.inStock && selectedDiameter.inStock;

  const ensurePrimaryItemInBag = () => {
    const itemId = `${catalog.sku}-${selectedFinish.id}-${selectedDiameter.id}`;
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: itemId,
          sku: catalog.sku,
          title: catalog.title,
          subtitle: `${selectedFinish.shortLabel} · ${selectedDiameter.label}`,
          unitPrice: currentPrice,
          quantity: 1,
          image: catalog.gallery[0].src,
        },
      ];
    });
  };

  const handleAddPrimaryToBag = () => {
    ensurePrimaryItemInBag();
    setBagInitialStep('cart');
    setBagOpen(true);
  };

  const handleBuyNowPrimary = () => {
    const itemId = `${catalog.sku}-${selectedFinish.id}-${selectedDiameter.id}`;
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) return prev;
      return [
        ...prev,
        {
          id: itemId,
          sku: catalog.sku,
          title: catalog.title,
          subtitle: `${selectedFinish.shortLabel} · ${selectedDiameter.label}`,
          unitPrice: currentPrice,
          quantity: 1,
          image: catalog.gallery[0].src,
        },
      ];
    });
    setBagInitialStep('checkout');
    setBagOpen(true);
  };

  const handleAddComplementaryToBag = (item: ComplementaryItem) => {
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: item.id,
          sku: item.sku,
          title: item.name,
          subtitle: item.metal,
          unitPrice: item.price,
          quantity: 1,
          image: item.image,
        },
      ];
    });
    setBagInitialStep('cart');
    setBagOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setBagItems((prev) => prev.filter((item) => item.id !== id));
  };

  const currentFavoriteId = `${catalog.sku}-${selectedFinish.id}-${selectedDiameter.id}`;
  const isCurrentWishlisted = isSaved(currentFavoriteId);

  const handleToggleCurrentWishlist = () => {
    toggleFavorite({
      id: currentFavoriteId,
      sku: catalog.sku,
      title: catalog.title,
      subtitle: `${selectedFinish.shortLabel} · ${selectedDiameter.label}`,
      unitPrice: currentPrice,
      image: catalog.gallery[0].src,
    });
  };

  const handleMoveFavoriteToBag = (fav: WishlistItem) => {
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === fav.id);
      if (existing) {
        return prev.map((i) => (i.id === fav.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: fav.id,
          sku: fav.sku,
          title: fav.title,
          subtitle: fav.subtitle,
          unitPrice: fav.unitPrice,
          quantity: 1,
          image: fav.image,
        },
      ];
    });
  };

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ProductCatalogProvider product={catalog}>
      <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#08080A] text-[#F4F4F6]">
        {/* Subtle atmospheric film grain */}
        <div className="fixed inset-0 z-50 grain-overlay pointer-events-none" aria-hidden="true" />

        <CustomCursor />

        <Navbar
          bagCount={totalBagCount}
          onOpenBag={() => {
            setBagInitialStep('cart');
            setBagOpen(true);
          }}
          onNavigate={handleNavigate}
        />

        <main className="pb-16 lg:pb-0">
          <ErrorBoundary title="Product Hero Unavailable">
            <HeroPurchaseSection
              selectedFinish={selectedFinish}
              onSelectFinish={setSelectedFinish}
              selectedDiameter={selectedDiameter}
              onSelectDiameter={setSelectedDiameter}
              isWishlisted={isCurrentWishlisted}
              onToggleWishlist={handleToggleCurrentWishlist}
              onAddToBag={handleAddPrimaryToBag}
              onBuyNow={handleBuyNowPrimary}
              onOpenTryOn={() => setTryOnOpen(true)}
              onScrollTo3D={() => handleNavigate('atelier-3d')}
              initialDeliveryEstimate={initialDeliveryEstimate}
            />
          </ErrorBoundary>

          <ErrorBoundary
            title="3D Atelier Preview Unavailable"
            description="Your browser encountered a WebGL interruption while rendering the Platinum 950 3D hoop."
          >
            <PlatinumBali3DViewer
              selectedFinish={selectedFinish}
              onSelectFinish={setSelectedFinish}
            />
          </ErrorBoundary>

          <CraftsmanshipBento />

          <ShopTheLookSection
            onAddComplementary={handleAddComplementaryToBag}
            onOpenCollection={() => setCollectionOpen(true)}
          />

          <ErrorBoundary title="Collector Reviews Temporarily Unavailable">
            <CustomerReviews initialReviews={initialReviews} />
          </ErrorBoundary>

          <SpecificationsSection
            selectedFinish={selectedFinish}
            selectedDiameter={selectedDiameter}
            onNavigate={handleNavigate}
          />
        </main>

        {/* Compact Mobile Sticky Buy Bar */}
        {showMobileBar && (
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0D0D11]/95 border-t border-white/[0.1] px-3.5 py-2 flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-[#A1A1AA] truncate">
                {selectedFinish.shortLabel} · {selectedDiameter.outerDiameter}
              </p>
              <p className="font-mono-tabular text-[14px] font-semibold text-[#F4F4F6]">
                {isCurrentInStock ? formatINR(currentPrice) : 'Out of Stock'}
              </p>
            </div>
            {isCurrentInStock ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAddPrimaryToBag}
                  className="px-3 py-2 min-h-[40px] border border-white/[0.2] bg-[#14141A] text-[#F4F4F6] text-[12px] font-medium whitespace-nowrap cursor-pointer"
                >
                  + Bag
                </button>
                <button
                  type="button"
                  onClick={handleBuyNowPrimary}
                  className="px-3.5 py-2 min-h-[40px] bg-[#D6C7AE] text-[#08080A] text-[12px] font-semibold whitespace-nowrap cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigate('overview')}
                className="px-3.5 py-2 min-h-[40px] bg-[#F4F4F6] text-[#08080A] text-[12px] font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Email Me
              </button>
            )}
          </div>
        )}

        <BagDrawer
          open={bagOpen}
          initialStep={bagInitialStep}
          onClose={() => setBagOpen(false)}
          items={bagItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearBag={() => setBagItems([])}
          favorites={favorites}
          onRemoveFavorite={removeFavorite}
          onMoveFavoriteToBag={handleMoveFavoriteToBag}
        />

        <TryOnModal open={tryOnOpen} onClose={() => setTryOnOpen(false)} />

        <PlatinumCollectionModal
          open={collectionOpen}
          onClose={() => setCollectionOpen(false)}
          onAddComplementary={handleAddComplementaryToBag}
        />
      </div>
      </MotionConfig>
    </ProductCatalogProvider>
  );
};
