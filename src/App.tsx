import React, { useEffect, useRef, useState } from 'react';
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
} from './data/product';
import { Navbar } from './components/Navbar';
import { HeroPurchaseSection } from './components/HeroPurchaseSection';
import { PlatinumBali3DViewer } from './components/PlatinumBali3DViewer';
import { CraftsmanshipBento } from './components/CraftsmanshipBento';
import { ShopTheLookSection } from './components/ShopTheLookSection';
import { CustomerReviews } from './components/CustomerReviews';
import { SpecificationsSection } from './components/SpecificationsSection';
import {
  BagDrawer,
  PlatinumCollectionModal,
  TryOnModal,
} from './components/BagAndTryOnModals';
import { CustomCursor } from './components/CustomCursor';
import { WishlistItem, useWishlist } from './hooks/useWishlist';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(PRODUCT_DATA.finishes[0]);
  const [selectedDiameter, setSelectedDiameter] = useState<DiameterOption>(
    PRODUCT_DATA.diameters[0]
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

  // Initialize Lenis smooth scrolling synced with GSAP ScrollTrigger
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
    PRODUCT_DATA.basePrice + selectedFinish.priceDelta + selectedDiameter.priceDelta;
  const isCurrentInStock = selectedFinish.inStock && selectedDiameter.inStock;

  const ensurePrimaryItemInBag = () => {
    const itemId = `${PRODUCT_DATA.sku}-${selectedFinish.id}-${selectedDiameter.id}`;
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: itemId,
          sku: PRODUCT_DATA.sku,
          title: PRODUCT_DATA.title,
          subtitle: `${selectedFinish.shortLabel} · ${selectedDiameter.label}`,
          unitPrice: currentPrice,
          quantity: 1,
          image: PRODUCT_DATA.gallery[0].src,
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
    const itemId = `${PRODUCT_DATA.sku}-${selectedFinish.id}-${selectedDiameter.id}`;
    setBagItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) return prev;
      return [
        ...prev,
        {
          id: itemId,
          sku: PRODUCT_DATA.sku,
          title: PRODUCT_DATA.title,
          subtitle: `${selectedFinish.shortLabel} · ${selectedDiameter.label}`,
          unitPrice: currentPrice,
          quantity: 1,
          image: PRODUCT_DATA.gallery[0].src,
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

  const currentFavoriteId = `${PRODUCT_DATA.sku}-${selectedFinish.id}-${selectedDiameter.id}`;
  const isCurrentWishlisted = isSaved(currentFavoriteId);

  const handleToggleCurrentWishlist = () => {
    toggleFavorite({
      id: currentFavoriteId,
      sku: PRODUCT_DATA.sku,
      title: PRODUCT_DATA.title,
      subtitle: `${selectedFinish.shortLabel} · ${selectedDiameter.label}`,
      unitPrice: currentPrice,
      image: PRODUCT_DATA.gallery[0].src,
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
          />

          <PlatinumBali3DViewer
            selectedFinish={selectedFinish}
            onSelectFinish={setSelectedFinish}
          />

          <CraftsmanshipBento />

          <ShopTheLookSection
            onAddComplementary={handleAddComplementaryToBag}
            onOpenCollection={() => setCollectionOpen(true)}
          />

          <CustomerReviews />

          <SpecificationsSection
            selectedFinish={selectedFinish}
            selectedDiameter={selectedDiameter}
            onNavigate={handleNavigate}
          />
        </main>

        {/* Compact Mobile Sticky Buy Bar (appears only after scrolling past hero CTA) */}
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
  );
}
