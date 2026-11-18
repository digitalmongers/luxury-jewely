import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Star, ShieldCheck, PenLine, X } from 'lucide-react';
import { SplitReveal } from './SplitReveal';

type FinishFilter = 'All' | 'Mirror 950' | 'Brushed Satin' | 'Champagne Trim';

interface ClientReview {
  id: string;
  author: string;
  city: string;
  finish: Exclude<FinishFilter, 'All'>;
  diameter: '14 mm Classic' | '18 mm Statement';
  rating: 5 | 4;
  date: string;
  headline: string;
  quote: string;
  verified: boolean;
}

const INITIAL_REVIEWS: ClientReview[] = [
  {
    id: 'rev-1',
    author: 'Ananya Deshmukh',
    city: 'Mumbai',
    finish: 'Mirror 950',
    diameter: '14 mm Classic',
    rating: 5,
    date: 'October 2026',
    headline: 'Reassuring platinum density without pulling the lobe',
    quote:
      'I switched from rhodium-plated white gold hoops that tarnished after two monsoons. The Trinity Triumph balis have a cool, liquid-mercury brilliance and a click-top hinge that closes with a crisp audible snap. I have worn them through 12-hour studio days and never once caught them on silk scarves.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Meera Krishnan',
    city: 'Bengaluru',
    finish: 'Brushed Satin',
    diameter: '18 mm Statement',
    rating: 5,
    date: 'September 2026',
    headline: 'Architectural restraint that pairs with everything',
    quote:
      'The hairline satin texture catches diffused light softly while the inner bevels stay mirror-bright. After booking the live video try-on, I chose the 18 mm size—it frames the jawline cleanly for evening dinners yet stays understated for boardroom mornings.',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Rhea Kapoor-Malhotra',
    city: 'New Delhi',
    finish: 'Champagne Trim',
    diameter: '14 mm Classic',
    rating: 5,
    date: 'November 2026',
    headline: 'Bridges my platinum and warm gold stacks effortlessly',
    quote:
      'Having the warm champagne center strand braided between pure Platinum 950 hoops means I can wear these alongside my heirloom gold bangles without clashing. Arrived sealed in the charcoal suede vault within 36 hours.',
    verified: true,
  },
  {
    id: 'rev-4',
    author: 'Dr. Kavita Subramanian',
    city: 'Chennai',
    finish: 'Mirror 950',
    diameter: '14 mm Classic',
    rating: 5,
    date: 'August 2026',
    headline: 'Zero nickel irritation—genuinely hypoallergenic',
    quote:
      'As a surgeon with sensitive skin, most alloyed posts irritate within hours. Platinum 950 is completely inert and comfortable even overnight. The PGI laser hallmark inside the inner curve is razor clear.',
    verified: true,
  },
  {
    id: 'rev-5',
    author: 'Zoya Merchant',
    city: 'Pune',
    finish: 'Mirror 950',
    diameter: '18 mm Statement',
    rating: 5,
    date: 'October 2026',
    headline: 'The three bezel diamonds add quiet fire up close',
    quote:
      'Not flashy from across the room—just three pinpricks of EF-VVS sparkle nestled inside the twisted strands whenever you turn your head. Paired mine with the Celeste double-arc ear cuff from the same edit.',
    verified: true,
  },
  {
    id: 'rev-6',
    author: 'Nandini Rao',
    city: 'Hyderabad',
    finish: 'Brushed Satin',
    diameter: '14 mm Classic',
    rating: 4,
    date: 'September 2026',
    headline: 'Precision hinge engineering and heirloom presentation',
    quote:
      'The suede jeweler tray alone feels like an exhibition piece. The clasp felt slightly firm on day one, which the Virelle stylist explained is intentional for tension longevity—after a week it glides smoothly.',
    verified: true,
  },
];

export const CustomerReviews: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [reviews, setReviews] = useState<ClientReview[]>(INITIAL_REVIEWS);
  const [filter, setFilter] = useState<FinishFilter>('All');
  const [composerOpen, setComposerOpen] = useState(false);

  // Review composer state
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [finish, setFinish] = useState<Exclude<FinishFilter, 'All'>>('Mirror 950');
  const [diameter, setDiameter] = useState<'14 mm Classic' | '18 mm Statement'>('14 mm Classic');
  const [rating, setRating] = useState<5 | 4>(5);
  const [headline, setHeadline] = useState('');
  const [quote, setQuote] = useState('');

  const filteredReviews = useMemo(() => {
    if (filter === 'All') return reviews;
    return reviews.filter((r) => r.finish === filter);
  }, [reviews, filter]);

  const totalBaseCount = 136 + reviews.length;
  const averageRating = useMemo(() => {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    // Weighted blend with historical 4.91 baseline across 136 verified buyers
    const blended = (4.91 * 136 + sum) / (136 + reviews.length);
    return blended.toFixed(2);
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !headline.trim() || !quote.trim()) return;
    const newEntry: ClientReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      city: city.trim() || 'India',
      finish,
      diameter,
      rating,
      date: 'November 2026',
      headline: headline.trim(),
      quote: quote.trim(),
      verified: true,
    };
    setReviews((prev) => [newEntry, ...prev]);
    setFilter('All');
    setAuthor('');
    setCity('');
    setHeadline('');
    setQuote('');
    setComposerOpen(false);
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 md:py-24 bg-[#08080A] border-b border-white/[0.08]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Header & Verified Rating Summary */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 pb-8 sm:pb-10 mb-8 sm:mb-10 border-b border-white/[0.08]">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[12px] tracking-[0.08em] text-[#D6C7AE] block">
              Client Chronicles
            </span>
            <SplitReveal
              as="h2"
              text="Verified Collector Impressions"
              className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] font-semibold text-[#F4F4F6]"
            />
            <p className="text-[14px] text-[#A1A1AA]">
              Authentic reflections from PGI-registered Platinum 950 Bali owners across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-4">
              <span className="font-mono-tabular text-3xl sm:text-4xl font-medium text-[#F4F4F6]">
                {averageRating}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1" aria-label={`${averageRating} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#D6C7AE] text-[#D6C7AE]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="font-mono-tabular text-[12px] text-[#9A9AA6]">
                  {totalBaseCount} Verified Purchases
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setComposerOpen((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-[13px] font-medium border border-white/[0.14] bg-[#101014] hover:border-[#D6C7AE] text-[#F4F4F6] transition-colors w-full sm:w-auto whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PenLine className="w-3.5 h-3.5 text-[#D6C7AE]" />
              <span>{composerOpen ? 'Close Form' : 'Share Your Impression'}</span>
            </button>
          </div>
        </div>

        {/* Optional Review Composer Panel */}
        {composerOpen && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 sm:mb-10 p-4 sm:p-6 md:p-8 bg-[#101014] border border-white/[0.12] space-y-4 sm:space-y-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F4F4F6]">
                Submit a Collector Review
              </h3>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                aria-label="Close review form"
                className="min-w-[44px] min-h-[44px] -mr-2 inline-flex items-center justify-center text-[#A1A1AA] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="rev-author" className="text-[12px] text-[#A1A1AA] block mb-1.5">
                  Your Name
                </label>
                <input
                  id="rev-author"
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Full name"
                  className="w-full min-h-[44px] bg-[#15151B] border border-white/[0.1] focus:border-[#D6C7AE] px-3 py-2 text-[13px] text-[#F4F4F6] outline-none"
                />
              </div>
              <div>
                <label htmlFor="rev-city" className="text-[12px] text-[#A1A1AA] block mb-1.5">
                  City
                </label>
                <input
                  id="rev-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full min-h-[44px] bg-[#15151B] border border-white/[0.1] focus:border-[#D6C7AE] px-3 py-2 text-[13px] text-[#F4F4F6] outline-none"
                />
              </div>
              <div>
                <label htmlFor="rev-finish" className="text-[12px] text-[#A1A1AA] block mb-1.5">
                  Finish Purchased
                </label>
                <select
                  id="rev-finish"
                  value={finish}
                  onChange={(e) => setFinish(e.target.value as Exclude<FinishFilter, 'All'>)}
                  className="w-full min-h-[44px] bg-[#15151B] border border-white/[0.1] focus:border-[#D6C7AE] px-3 py-2 text-[13px] text-[#F4F4F6] outline-none"
                >
                  <option value="Mirror 950">Mirror 950</option>
                  <option value="Brushed Satin">Brushed Satin</option>
                  <option value="Champagne Trim">Champagne Trim</option>
                </select>
              </div>
              <div>
                <label htmlFor="rev-diameter" className="text-[12px] text-[#A1A1AA] block mb-1.5">
                  Diameter &amp; Rating
                </label>
                <div className="flex gap-2">
                  <select
                    id="rev-diameter"
                    value={diameter}
                    onChange={(e) =>
                      setDiameter(e.target.value as '14 mm Classic' | '18 mm Statement')
                    }
                    className="flex-1 min-h-[44px] bg-[#15151B] border border-white/[0.1] focus:border-[#D6C7AE] px-2.5 py-2 text-[13px] text-[#F4F4F6] outline-none"
                  >
                    <option value="14 mm Classic">14 mm</option>
                    <option value="18 mm Statement">18 mm</option>
                  </select>
                  <select
                    aria-label="Star rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value) as 5 | 4)}
                    className="w-20 min-h-[44px] bg-[#15151B] border border-white/[0.1] focus:border-[#D6C7AE] px-2.5 py-2 text-[13px] font-mono-tabular text-[#F4F4F6] outline-none"
                  >
                    <option value={5}>5 ★</option>
                    <option value={4}>4 ★</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="rev-headline" className="text-[12px] text-[#A1A1AA] block mb-1.5">
                  Review Headline
                </label>
                <input
                  id="rev-headline"
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Summarize your experience with the Platinum 950 Balis"
                  className="w-full min-h-[44px] bg-[#15151B] border border-white/[0.1] focus:border-[#D6C7AE] px-3 py-2 text-[13px] text-[#F4F4F6] outline-none"
                />
              </div>
              <div>
                <label htmlFor="rev-quote" className="text-[12px] text-[#A1A1AA] block mb-1.5">
                  Detailed Impression
                </label>
                <textarea
                  id="rev-quote"
                  rows={3}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Share thoughts on the finish, clasp tension, weight, or styling..."
                  className="w-full bg-[#15151B] border border-white/[0.1] focus:border-[#D6C7AE] px-3 py-2.5 text-[13px] text-[#F4F4F6] outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-[#F4F4F6] hover:bg-[#D6C7AE] text-[#08080A] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}

        {/* Finish Filter Segmented Control */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-8">
          {(['All', 'Mirror 950', 'Brushed Satin', 'Champagne Trim'] as FinishFilter[]).map(
            (tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 text-[12px] font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#F4F4F6] border-[#F4F4F6] text-[#08080A]'
                      : 'bg-[#101014] border-white/[0.08] text-[#A1A1AA] hover:text-[#F4F4F6]'
                  }`}
                >
                  {tab === 'All' ? 'All Finishes' : tab}
                </button>
              );
            }
          )}
        </div>

        {/* Multi-column Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
          {filteredReviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
              className="break-inside-avoid bg-[#101014] border border-white/[0.08] p-5 sm:p-6 md:p-7 space-y-4 sm:space-y-5"
            >
              {/* Rating + Date Line (Zero Pill Enclosures) */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3.5 h-3.5 ${
                        starIdx < review.rating
                          ? 'fill-[#D6C7AE] text-[#D6C7AE]'
                          : 'text-white/20'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="font-mono-tabular text-[11px] text-[#9A9AA6]">
                  {review.date}
                </span>
              </div>

              {/* Editorial Serif Headline + Quote */}
              <div className="space-y-2.5">
                <h3 className="font-display text-2xl leading-[1.18] font-semibold text-[#F4F4F6]">
                  &ldquo;{review.headline}&rdquo;
                </h3>
                <p className="text-[14px] leading-[1.7] text-[#B4B4BE]">{review.quote}</p>
              </div>

              {/* Author & Verified Variant Metadata */}
              <div className="pt-4 border-t border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-[#F4F4F6]">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#D6C7AE]">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[#9A9AA6]">
                  <span>{review.city}</span>
                  <span aria-hidden="true">·</span>
                  <span>{review.finish}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">{review.diameter}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
