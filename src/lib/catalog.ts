import { unstable_cache } from 'next/cache';
import { PRODUCT_DATA } from '@/src/data/product';
import { resolveProductWithCloudinary } from './cloudinary';
import type { ValidDiameter, ValidFinish, ValidatedReviewInput } from './validation';

export interface ClientReview {
  id: string;
  author: string;
  city: string;
  finish: ValidFinish;
  diameter: ValidDiameter;
  rating: 5 | 4;
  date: string;
  headline: string;
  quote: string;
  verified: boolean;
}

export interface DeliveryEstimate {
  postalCode: string;
  regionLabel: string;
  courierMethod: string;
  minDays: number;
  maxDays: number;
  arrivalWindow: string;
  dispatchNote: string;
}

export const INITIAL_REVIEWS: ClientReview[] = [
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

// Global store preserved across module reloads in dev/serverless warm instances
const globalStore = globalThis as typeof globalThis & {
  __virelleReviewsStore?: ClientReview[];
};

function getReviewsStore(): ClientReview[] {
  if (!globalStore.__virelleReviewsStore) {
    globalStore.__virelleReviewsStore = [...INITIAL_REVIEWS];
  }
  return globalStore.__virelleReviewsStore;
}

export const getCachedProductCatalog = unstable_cache(
  async () => {
    const product = await resolveProductWithCloudinary(PRODUCT_DATA);
    return {
      product,
      defaultEstimate: computeDeliveryEstimate('400001'),
      cachedAt: new Date().toISOString(),
    };
  },
  ['virelle-catalog-ebal0094'],
  {
    revalidate: 300,
    tags: ['product-ebal0094', 'catalog'],
  }
);

export const getCachedReviews = unstable_cache(
  async () => {
    return [...getReviewsStore()];
  },
  ['virelle-reviews-ebal0094'],
  {
    revalidate: 300,
    tags: ['reviews-ebal0094', 'catalog'],
  }
);

export function addVerifiedReview(input: ValidatedReviewInput): ClientReview {
  const newReview: ClientReview = {
    id: `rev-${Date.now()}`,
    author: input.author,
    city: input.city,
    finish: input.finish,
    diameter: input.diameter,
    rating: input.rating,
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    headline: input.headline,
    quote: input.quote,
    verified: true,
  };

  const store = getReviewsStore();
  store.unshift(newReview);
  return newReview;
}

function addBusinessDays(startDate: Date, businessDays: number): Date {
  const result = new Date(startDate);
  let added = 0;
  while (added < businessDays) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0) {
      added += 1;
    }
  }
  return result;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

function getMumbaiHour(date: Date): number {
  const hourStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(date);
  return Number(hourStr) % 24;
}

export function computeDeliveryEstimate(rawCode: string): DeliveryEstimate {
  const cleaned = rawCode.trim().toUpperCase();
  const digits = cleaned.replace(/\D/g, '');
  const now = new Date();
  const dispatchCutOff = getMumbaiHour(now) < 15;
  const dispatchLead = dispatchCutOff ? 0 : 1;
  const dispatchNote = dispatchCutOff
    ? 'Dispatches today from Mumbai Atelier vault'
    : 'Dispatches next business morning from Mumbai Atelier';

  let regionLabel = 'Standard Domestic Courier';
  let courierMethod = 'Sequel Insured Armored Vault';
  let minTransit = 3;
  let maxTransit = 4;

  if (digits.length === 6) {
    if (digits.startsWith('400')) {
      regionLabel = `Mumbai Metro (${digits})`;
      courierMethod = 'Dedicated White-Glove Hand Courier';
      minTransit = 1;
      maxTransit = 1;
    } else if (
      ['110', '560', '500', '600', '700', '411', '380'].some((p) => digits.startsWith(p))
    ) {
      regionLabel = `Tier-1 Metro (${digits})`;
      courierMethod = 'Sequel Insured Express Air Vault';
      minTransit = 1;
      maxTransit = 2;
    } else {
      regionLabel = `India Postal (${digits})`;
      courierMethod = 'Sequel Insured Vault Transit';
      minTransit = 3;
      maxTransit = 4;
    }
  } else if (digits.length === 5) {
    const firstDigit = digits[0];
    const coastLabel =
      firstDigit === '0' || firstDigit === '1' || firstDigit === '2'
        ? 'US East Coast'
        : firstDigit === '8' || firstDigit === '9'
          ? 'US West Coast'
          : 'United States';
    regionLabel = `${coastLabel} (${digits})`;
    courierMethod = 'Brink’s Global Priority Air Vault';
    minTransit = 4;
    maxTransit = 6;
  } else if (cleaned.length >= 4) {
    regionLabel = `International (${cleaned})`;
    courierMethod = 'DHL Express Insured Jewellery Vault';
    minTransit = 5;
    maxTransit = 7;
  }

  const minDays = dispatchLead + minTransit;
  const maxDays = dispatchLead + maxTransit;
  const minDate = addBusinessDays(now, minDays);
  const maxDate = addBusinessDays(now, maxDays);

  const arrivalWindow =
    minDays === maxDays
      ? formatShortDate(minDate)
      : `${formatShortDate(minDate)} – ${formatShortDate(maxDate)}`;

  return {
    postalCode: cleaned || '400001',
    regionLabel,
    courierMethod,
    minDays,
    maxDays,
    arrivalWindow,
    dispatchNote,
  };
}
