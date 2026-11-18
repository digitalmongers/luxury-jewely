import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { PRODUCT_DATA } from '../data/product';

interface NavbarProps {
  bagCount: number;
  onOpenBag: () => void;
  onNavigate: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ bagCount, onOpenBag, onNavigate }) => {
  const links = [
    { label: 'Overview', target: 'overview' },
    { label: '360° Atelier', target: 'atelier-3d' },
    { label: 'Craftsmanship', target: 'craftsmanship' },
    { label: 'Shop the Look', target: 'shop-the-look' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08080A]/92 border-b border-white/[0.08]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 h-14 md:h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('overview');
          }}
          className="font-display text-xl sm:text-2xl font-semibold tracking-[0.06em] text-[#F4F4F6] whitespace-nowrap shrink-0 hover:text-[#D6C7AE] transition-colors"
        >
          {PRODUCT_DATA.brand}
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.target}
              href={`#${link.target}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.target);
              }}
              className="relative text-[13px] font-medium text-[#A1A1AA] hover:text-[#F4F4F6] transition-colors whitespace-nowrap shrink-0 py-1 group"
            >
              {link.label}
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#D6C7AE] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <button
          type="button"
          onClick={onOpenBag}
          aria-label={`Open shopping bag with ${bagCount} items`}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[40px] text-[13px] font-medium text-[#08080A] bg-[#F4F4F6] hover:bg-[#D6C7AE] rounded-sm transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="tabular-nums">Bag ({bagCount})</span>
        </button>
      </div>
    </header>
  );
};
