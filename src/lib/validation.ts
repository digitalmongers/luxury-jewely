import { ApiError } from './errors';

export const ALLOWED_FINISHES = ['Mirror 950', 'Brushed Satin', 'Champagne Trim'] as const;
export const ALLOWED_DIAMETERS = ['14 mm Classic', '18 mm Statement'] as const;
export const ALLOWED_REVALIDATE_TAGS = [
  'product-ebal0094',
  'catalog',
  'reviews-ebal0094',
] as const;
export const ALLOWED_REVALIDATE_PATHS = ['/'] as const;

export type ValidFinish = (typeof ALLOWED_FINISHES)[number];
export type ValidDiameter = (typeof ALLOWED_DIAMETERS)[number];

export interface ValidatedReviewInput {
  author: string;
  city: string;
  finish: ValidFinish;
  diameter: ValidDiameter;
  rating: 4 | 5;
  headline: string;
  quote: string;
}

export function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function validatePostalCode(rawCode: unknown): string {
  const cleaned = sanitizeText(rawCode, 12).toUpperCase();
  if (!cleaned) {
    throw new ApiError(400, 'INVALID_POSTAL_CODE', 'Please enter a valid ZIP or PIN code.');
  }

  const digitsOnly = cleaned.replace(/\D/g, '');
  const validFormat = /^[A-Z0-9\s-]{4,10}$/.test(cleaned);
  if (!validFormat || (digitsOnly.length < 5 && cleaned.length < 4)) {
    throw new ApiError(
      400,
      'INVALID_POSTAL_CODE',
      'Enter a valid 5-digit ZIP code, 6-digit PIN code, or international postal code.'
    );
  }

  return cleaned;
}

export function validateReviewInput(raw: Record<string, unknown>): ValidatedReviewInput {
  const details: Record<string, string> = {};

  const author = sanitizeText(raw.author, 80);
  if (author.length < 2) {
    details.author = 'Author name must be at least 2 characters.';
  }

  const city = sanitizeText(raw.city, 60) || 'India';

  const finish = sanitizeText(raw.finish, 40) as ValidFinish;
  if (!ALLOWED_FINISHES.includes(finish)) {
    details.finish = 'Select a valid Platinum 950 finish.';
  }

  const diameter = sanitizeText(raw.diameter, 40) as ValidDiameter;
  if (!ALLOWED_DIAMETERS.includes(diameter)) {
    details.diameter = 'Select a valid outer diameter.';
  }

  const numericRating = Number(raw.rating);
  if (numericRating !== 4 && numericRating !== 5) {
    details.rating = 'Rating must be 4 or 5 stars.';
  }

  const headline = sanitizeText(raw.headline, 140);
  if (headline.length < 4) {
    details.headline = 'Review headline must be at least 4 characters.';
  }

  const quote = sanitizeText(raw.quote, 900);
  if (quote.length < 12) {
    details.quote = 'Detailed impression must be at least 12 characters.';
  }

  if (Object.keys(details).length > 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Review submission validation failed.', details);
  }

  return {
    author,
    city,
    finish,
    diameter,
    rating: numericRating as 4 | 5,
    headline,
    quote,
  };
}

export function validateRevalidateInput(raw: Record<string, unknown>): {
  tags: string[];
  paths: string[];
} {
  const tags: string[] = [];
  const paths: string[] = [];

  if (typeof raw.tag === 'string' && raw.tag.trim()) {
    const tag = raw.tag.trim();
    if (!(ALLOWED_REVALIDATE_TAGS as readonly string[]).includes(tag)) {
      throw new ApiError(400, 'INVALID_TAG', `Unsupported cache tag: ${tag}`);
    }
    tags.push(tag);
  }

  if (Array.isArray(raw.tags)) {
    for (const entry of raw.tags) {
      if (typeof entry === 'string' && (ALLOWED_REVALIDATE_TAGS as readonly string[]).includes(entry)) {
        if (!tags.includes(entry)) tags.push(entry);
      }
    }
  }

  if (typeof raw.path === 'string' && raw.path.trim()) {
    const p = raw.path.trim();
    if (!(ALLOWED_REVALIDATE_PATHS as readonly string[]).includes(p)) {
      throw new ApiError(400, 'INVALID_PATH', `Unsupported revalidation path: ${p}`);
    }
    paths.push(p);
  }

  if (tags.length === 0 && paths.length === 0) {
    tags.push('catalog', 'product-ebal0094', 'reviews-ebal0094');
    paths.push('/');
  }

  return { tags, paths };
}
