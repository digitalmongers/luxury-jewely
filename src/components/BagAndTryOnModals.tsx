import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  Heart,
  ArrowLeft,
  Lock,
  Gift,
  Check,
} from 'lucide-react';
import { CartItem, ComplementaryItem, PRODUCT_DATA, formatINR } from '../data/product';
import { WishlistItem } from '../hooks/useWishlist';

interface BagDrawerProps {
  open: boolean;
  initialStep?: 'cart' | 'checkout';
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearBag: () => void;
  favorites: WishlistItem[];
  onRemoveFavorite: (id: string) => void;
  onMoveFavoriteToBag: (fav: WishlistItem) => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  open,
  initialStep = 'cart',
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
  favorites,
  onRemoveFavorite,
  onMoveFavoriteToBag,
}) => {
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'bag' | 'favorites'>('bag');
  const [step, setStep] = useState<'cart' | 'checkout'>(initialStep);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);
  const [includePersonalizedNote, setIncludePersonalizedNote] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState('400001');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wire'>('upi');
  const [orderConfirmed, setOrderConfirmed] = useState<{
    orderId: string;
    total: number;
    method: string;
    giftWrapped: boolean;
    giftNote: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setActiveTab('bag');
      setStep(initialStep);
      setOrderConfirmed(null);
    }
  }, [open, initialStep]);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const methodLabel =
      paymentMethod === 'upi'
        ? 'UPI Instant Vault Pay'
        : paymentMethod === 'card'
          ? 'Credit / Debit Card'
          : 'Private Atelier Wire';
    setOrderConfirmed({
      orderId: `VRL-${Math.floor(1000 + Math.random() * 9000)}`,
      total: subtotal,
      method: methodLabel,
      giftWrapped: includeGiftWrap,
      giftNote: includePersonalizedNote ? giftNote.trim() : '',
    });
    setStep('cart');
    onClearBag();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70"
          />

          <motion.aside
            initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-[#0E0E12] border-l border-white/[0.1] h-full flex flex-col"
          >
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-white/[0.08] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#F4F4F6]">
                  {activeTab === 'favorites'
                    ? 'Saved Favorites'
                    : step === 'checkout' && items.length > 0 && !orderConfirmed
                      ? 'Express Vault Checkout'
                      : 'Your Atelier Bag'}
                </h2>
                <p className="text-[12px] text-[#9A9AA6] truncate">
                  {activeTab === 'favorites'
                    ? 'Persisted across sessions for your account'
                    : step === 'checkout' && items.length > 0 && !orderConfirmed
                      ? 'PGI insured armored delivery · Incl. all taxes'
                      : 'Complimentary insured vault transit'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderConfirmed(null);
                  onClose();
                }}
                aria-label="Close shopping bag"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#A1A1AA] hover:text-[#F4F4F6] cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Tab Switcher: Bag | Saved */}
            <div className="px-4 sm:px-6 py-2.5 border-b border-white/[0.06] grid grid-cols-2 gap-2 bg-[#0B0B0E]">
              <button
                type="button"
                onClick={() => setActiveTab('bag')}
                className={`py-2.5 min-h-[42px] text-[12px] font-medium transition-colors cursor-pointer ${
                  activeTab === 'bag'
                    ? 'bg-[#F4F4F6] text-[#08080A]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F6]'
                }`}
              >
                Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`py-2.5 min-h-[42px] text-[12px] font-medium transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'favorites'
                    ? 'bg-[#F4F4F6] text-[#08080A]'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F6]'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span>Saved ({favorites.length})</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-5">
              {activeTab === 'favorites' ? (
                favorites.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <p className="font-display text-2xl text-[#E4E4E7]">No saved pieces yet</p>
                    <p className="text-[13px] text-[#9A9AA6]">
                      Tap the Wishlist heart in the product header to save your preferred finish.
                    </p>
                  </div>
                ) : (
                  favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="flex gap-3.5 sm:gap-4 pb-5 border-b border-white/[0.08]"
                    >
                      <img
                        src={fav.image}
                        alt={fav.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 object-cover border border-white/[0.08] bg-[#141419] shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[14px] font-medium text-[#F4F4F6] leading-snug">
                            {fav.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveFavorite(fav.id)}
                            aria-label={`Remove ${fav.title} from saved`}
                            className="text-[#71717A] hover:text-[#F4F4F6] min-w-[36px] min-h-[36px] inline-flex items-center justify-center -mr-1.5 -mt-1.5 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[12px] text-[#9A9AA6]">{fav.subtitle}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                          <span className="font-mono-tabular text-[14px] font-medium text-[#F4F4F6]">
                            {formatINR(fav.unitPrice)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onMoveFavoriteToBag(fav);
                              setStep('cart');
                              setActiveTab('bag');
                            }}
                            className="px-3.5 py-2 min-h-[38px] text-[11px] font-semibold bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Move to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : orderConfirmed ? (
                <div className="p-5 sm:p-6 bg-[#131319] border border-[#D6C7AE]/40 space-y-3">
                  <div className="flex items-center gap-2.5 text-[#D6C7AE]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      Order #{orderConfirmed.orderId} Confirmed
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#D4D4D8]">
                    Your Virelle Platinum Atelier order ({formatINR(orderConfirmed.total)} via{' '}
                    {orderConfirmed.method}) is queued for assay seal verification and insured vault
                    dispatch to PIN/ZIP{' '}
                    <span className="font-mono-tabular text-white">{postalCode || '400001'}</span>.
                  </p>
                  {recipientName && (
                    <p className="text-[12px] text-[#A1A1AA] border-t border-white/[0.06] pt-2">
                      Recipient: <span className="text-[#F4F4F6]">{recipientName}</span>
                    </p>
                  )}
                  {orderConfirmed.giftWrapped && (
                    <p className="text-[12px] text-[#D6C7AE] border-t border-white/[0.06] pt-2 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 shrink-0" />
                      <span>Signature Gift Wrap &amp; Wax-Sealed Coffret Included</span>
                    </p>
                  )}
                  {orderConfirmed.giftNote && (
                    <p className="text-[12px] text-[#9A9AA6] border-t border-white/[0.06] pt-2 break-words">
                      Personalized note: &ldquo;{orderConfirmed.giftNote}&rdquo;
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setOrderConfirmed(null);
                      onClose();
                    }}
                    className="mt-2 w-full py-3 min-h-[44px] bg-[#F4F4F6] text-[#08080A] text-xs font-semibold cursor-pointer"
                  >
                    Return to Atelier
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <p className="font-display text-2xl text-[#E4E4E7]">Your bag is empty</p>
                  <p className="text-[13px] text-[#9A9AA6]">
                    Select a Platinum 950 finish and silhouette to begin your order.
                  </p>
                </div>
              ) : step === 'checkout' ? (
                <form id="atelier-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#D6C7AE] hover:text-white cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Bag Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  </button>

                  {/* Compact Order Summary */}
                  <div className="p-3.5 bg-[#131318] border border-white/[0.08] space-y-2.5">
                    <span className="text-[11px] uppercase tracking-[0.06em] text-[#9A9AA6] block">
                      Order Summary
                    </span>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-[12px]">
                        <div className="min-w-0">
                          <p className="text-[#F4F4F6] font-medium truncate">
                            {item.quantity}× {item.title}
                          </p>
                          <p className="text-[11px] text-[#9A9AA6] truncate">{item.subtitle}</p>
                        </div>
                        <span className="font-mono-tabular text-[#F4F4F6] shrink-0">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Details */}
                  <div className="space-y-3">
                    <span className="text-[12px] font-medium text-[#E4E4E7] block">
                      Insured Vault Recipient
                    </span>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Full Name (for government ID vault handoff)"
                      className="w-full min-h-[44px] bg-[#121217] border border-white/[0.12] focus:border-[#D6C7AE] px-3 py-2 text-[13px] text-[#F4F4F6] outline-none"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Street / Residence Address"
                        className="sm:col-span-2 w-full min-h-[44px] bg-[#121217] border border-white/[0.12] focus:border-[#D6C7AE] px-3 py-2 text-[13px] text-[#F4F4F6] outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="PIN / ZIP"
                        className="w-full min-h-[44px] bg-[#121217] border border-white/[0.12] focus:border-[#D6C7AE] px-3 py-2 text-[13px] font-mono-tabular text-[#F4F4F6] outline-none"
                      />
                    </div>
                  </div>

                  {/* Gift Options */}
                  <div className="p-3.5 sm:p-4 bg-[#131318] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-medium text-[#E4E4E7] inline-flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#D6C7AE]" />
                        <span>Gift Options</span>
                      </span>
                      <span className="text-[11px] text-[#9A9AA6]">Complimentary</span>
                    </div>

                    <div className="space-y-2">
                      {/* Toggle: Gift wrap */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={includeGiftWrap}
                        onClick={() => setIncludeGiftWrap((prev) => !prev)}
                        className={`w-full min-h-[44px] px-3 py-2.5 border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          includeGiftWrap
                            ? 'border-[#D6C7AE] bg-[#191921]'
                            : 'border-white/[0.08] bg-[#101014] hover:border-white/[0.2]'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-[12px] font-medium text-[#F4F4F6] block">
                            Gift wrap
                          </span>
                          <span className="text-[11px] text-[#9A9AA6] block">
                            Obsidian coffret, silk ribbon &amp; wax seal
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className={`w-5 h-5 border inline-flex items-center justify-center shrink-0 transition-colors ${
                            includeGiftWrap
                              ? 'bg-[#D6C7AE] border-[#D6C7AE] text-[#08080A]'
                              : 'border-white/[0.25] bg-transparent'
                          }`}
                        >
                          {includeGiftWrap && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </button>

                      {/* Toggle: Add a personalized note */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={includePersonalizedNote}
                        onClick={() => setIncludePersonalizedNote((prev) => !prev)}
                        className={`w-full min-h-[44px] px-3 py-2.5 border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          includePersonalizedNote
                            ? 'border-[#D6C7AE] bg-[#191921]'
                            : 'border-white/[0.08] bg-[#101014] hover:border-white/[0.2]'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-[12px] font-medium text-[#F4F4F6] block">
                            Add a personalized note
                          </span>
                          <span className="text-[11px] text-[#9A9AA6] block">
                            Hand-inscribed on archival cotton vellum card
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className={`w-5 h-5 border inline-flex items-center justify-center shrink-0 transition-colors ${
                            includePersonalizedNote
                              ? 'bg-[#D6C7AE] border-[#D6C7AE] text-[#08080A]'
                              : 'border-white/[0.25] bg-transparent'
                          }`}
                        >
                          {includePersonalizedNote && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                    </div>

                    {includePersonalizedNote && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between gap-2">
                          <label htmlFor="checkout-gift-note" className="text-[11px] text-[#A1A1AA]">
                            Personalized Note Message
                          </label>
                          <span className="font-mono-tabular text-[11px] text-[#71717A]">
                            {giftNote.length}/240
                          </span>
                        </div>
                        <textarea
                          id="checkout-gift-note"
                          rows={3}
                          maxLength={240}
                          value={giftNote}
                          onChange={(e) => setGiftNote(e.target.value)}
                          placeholder="Enter your personalized message to be enclosed with this order..."
                          className="w-full bg-[#101015] border border-white/[0.12] focus:border-[#D6C7AE] px-3 py-2.5 text-[13px] text-[#F4F4F6] placeholder:text-[#71717A] outline-none resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2.5">
                    <span className="text-[12px] font-medium text-[#E4E4E7] block">
                      Payment Method
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'upi' as const, label: 'UPI Pay' },
                        { id: 'card' as const, label: 'Card' },
                        { id: 'wire' as const, label: 'Vault Wire' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`py-2.5 px-2 min-h-[44px] text-[12px] font-medium border transition-colors cursor-pointer ${
                            paymentMethod === m.id
                              ? 'border-[#D6C7AE] bg-[#191921] text-[#F4F4F6]'
                              : 'border-white/[0.1] bg-[#111116] text-[#A1A1AA]'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 sm:gap-4 pb-5 border-b border-white/[0.08]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover border border-white/[0.08] bg-[#141419] shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[14px] font-medium text-[#F4F4F6] leading-snug">
                          {item.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="text-[#71717A] hover:text-[#F4F4F6] min-w-[36px] min-h-[36px] inline-flex items-center justify-center -mr-1.5 -mt-1.5 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[12px] text-[#9A9AA6]">{item.subtitle}</p>
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <div className="inline-flex items-center border border-white/[0.12]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            aria-label="Decrease quantity"
                            className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-[12px] font-mono-tabular text-[#F4F4F6]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            aria-label="Increase quantity"
                            className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-mono-tabular text-[14px] font-medium text-[#F4F4F6]">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {activeTab === 'bag' && step === 'cart' && items.length > 0 && !orderConfirmed && (
                <p className="text-[12px] text-[#9A9AA6] flex items-center gap-1.5 pt-1">
                  <Gift className="w-3.5 h-3.5 text-[#D6C7AE] shrink-0" />
                  <span>Complimentary gift wrap &amp; personalized notes available at checkout.</span>
                </p>
              )}
            </div>

            {activeTab === 'bag' && items.length > 0 && !orderConfirmed && (
              <div className="p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/[0.08] bg-[#0B0B0E] space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#A1A1AA]">Insured Vault Delivery</span>
                  <span className="text-[#D6C7AE]">Complimentary</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[#F4F4F6]">Total (Incl. GST)</span>
                  <span className="font-mono-tabular text-xl font-semibold text-[#F4F4F6]">
                    {formatINR(subtotal)}
                  </span>
                </div>
                {step === 'checkout' ? (
                  <button
                    type="submit"
                    form="atelier-checkout-form"
                    className="w-full py-3.5 min-h-[48px] bg-[#D6C7AE] hover:bg-[#e5d8c2] text-[#08080A] text-[13px] font-semibold tracking-wide transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Complete Purchase · {formatINR(subtotal)}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 min-h-[48px] bg-[#D6C7AE] hover:bg-[#e5d8c2] text-[#08080A] text-[13px] font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    Buy Now · {formatINR(subtotal)}
                  </button>
                )}
                <p className="text-[11px] text-[#71717A] flex items-center justify-center gap-1.5 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D6C7AE] shrink-0" />
                  <span>PGI &amp; BIS Certified · 30-Day Insured Return</span>
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

interface TryOnModalProps {
  open: boolean;
  onClose: () => void;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ open, onClose }) => {
  const [date, setDate] = useState('Tomorrow');
  const [slot, setSlot] = useState('16:00 IST');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Live Video Try-On Concierge"
        >
          <div onClick={onClose} className="fixed inset-0 bg-black/75" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#101015] border border-white/[0.12] p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] tracking-[0.08em] uppercase text-[#D6C7AE]">
                  Private Atelier Session
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#F4F4F6] mt-1">
                  Live Video Try-On · EBAL0094
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                aria-label="Close modal"
                className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 inline-flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-4 sm:p-5 bg-[#16161C] border border-[#D6C7AE]/40 space-y-3">
                <p className="text-sm font-semibold text-[#D6C7AE]">
                  Concierge Session Reserved ({date} · {slot})
                </p>
                <p className="text-[13px] text-[#D4D4D8]">
                  A senior Platinum Specialist will send your private HD studio link to{' '}
                  <span className="text-white font-medium break-all">{contact}</span> with both 14 mm and 18
                  mm silhouettes ready for live ear-scale comparison.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-[#F4F4F6] text-[#08080A] text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[12px] text-[#A1A1AA] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D6C7AE]" /> Preferred Day
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'This Weekend'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDate(d)}
                        className={`py-2.5 px-3 min-h-[44px] text-[12px] border cursor-pointer ${
                          date === d
                            ? 'border-[#D6C7AE] bg-[#191921] text-white'
                            : 'border-white/[0.1] text-[#A1A1AA]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[12px] text-[#A1A1AA] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D6C7AE]" /> Time Slot
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['12:30 IST', '16:00 IST', '19:30 IST'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSlot(t)}
                        className={`py-2.5 px-2 min-h-[44px] text-[12px] font-mono-tabular border cursor-pointer ${
                          slot === t
                            ? 'border-[#D6C7AE] bg-[#191921] text-white'
                            : 'border-white/[0.1] text-[#A1A1AA]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="tryon-contact" className="text-[12px] text-[#A1A1AA] block">
                    Email or WhatsApp Number
                  </label>
                  <input
                    id="tryon-contact"
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="name@example.com or +91 98..."
                    className="w-full min-h-[44px] bg-[#14141A] border border-white/[0.12] focus:border-[#D6C7AE] px-3 py-2.5 text-[13px] text-[#F4F4F6] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 min-h-[46px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  Reserve 1-on-1 Video Appointment
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
  onAddComplementary: (item: ComplementaryItem) => void;
}

export const PlatinumCollectionModal: React.FC<CollectionModalProps> = ({
  open,
  onClose,
  onAddComplementary,
}) => {
  const [filter, setFilter] = useState<'All' | ComplementaryItem['category']>('All');

  const categories: Array<'All' | ComplementaryItem['category']> = [
    'All',
    'Necklaces',
    'Bracelets',
    'Rings',
    'Ear Cuffs',
  ];

  const items =
    filter === 'All'
      ? PRODUCT_DATA.complementaryItems
      : PRODUCT_DATA.complementaryItems.filter((i) => i.category === filter);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Platinum Atelier Collection"
        >
          <div onClick={onClose} className="fixed inset-0 bg-black/80" />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="relative z-10 w-full max-w-5xl max-h-[92vh] bg-[#0E0E12] border border-white/[0.12] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="shrink-0 px-4 py-3.5 sm:px-6 sm:py-5 border-b border-white/[0.08] flex items-start sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] tracking-[0.08em] uppercase text-[#D6C7AE] block">
                  Virelle Platinum Atelier
                </span>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-[#F4F4F6] leading-tight">
                  The Complete Trinity Platinum Edit
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close collection explorer"
                className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 inline-flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile-First Horizontally Scrollable Category Tabs */}
            <div className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto bg-[#0B0B0F]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-3.5 py-2 min-h-[40px] text-[12px] font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filter === cat
                      ? 'bg-[#F4F4F6] border-[#F4F4F6] text-[#08080A]'
                      : 'bg-[#15151B] border-white/[0.08] text-[#A1A1AA] hover:text-[#F4F4F6]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile-First Product Grid: 1-col vertical (mobile) -> 2-col vertical (tablet) -> 2-col horizontal (desktop lg+) */}
            <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 content-start">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-[#131318] border border-white/[0.1] hover:border-white/[0.22] transition-colors flex flex-col lg:flex-row overflow-hidden"
                >
                  <div className="w-full lg:w-44 xl:w-48 aspect-[4/3] lg:aspect-auto bg-[#0A0A0D] shrink-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/[0.06]">
                    <img
                      src={item.image}
                      alt={item.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col justify-between gap-4 flex-1 min-w-0">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] uppercase tracking-[0.06em] text-[#9A9AA6] block">
                        {item.category} · <span className="font-mono-tabular">{item.sku}</span>
                      </span>
                      <h3 className="text-[15px] font-semibold text-[#F4F4F6] leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-[12px] text-[#A1A1AA]">{item.metal}</p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] uppercase tracking-[0.05em] text-[#9A9AA6]">
                          Atelier Price
                        </span>
                        <span className="font-mono-tabular text-[15px] font-semibold text-[#F4F4F6]">
                          {formatINR(item.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onAddComplementary(item);
                          onClose();
                        }}
                        className="w-full px-4 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-wide bg-[#D6C7AE] hover:bg-[#e5d8c2] text-[#08080A] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
