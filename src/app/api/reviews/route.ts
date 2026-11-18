import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { addVerifiedReview, getCachedReviews } from '@/src/lib/catalog';
import { createErrorResponse, parseJsonBody } from '@/src/lib/errors';
import { validateReviewInput } from '@/src/lib/validation';

export async function GET() {
  try {
    const reviews = await getCachedReviews();
    return NextResponse.json(
      { reviews },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    return createErrorResponse(err, 'api/reviews:GET');
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<Record<string, unknown>>(request);
    const validated = validateReviewInput(body);
    const review = addVerifiedReview(validated);

    // Revalidate cached reviews & main product page (Next.js 16 requires cacheLife profile)
    revalidateTag('reviews-ebal0094', 'max');
    revalidateTag('catalog', 'max');
    revalidatePath('/');

    return NextResponse.json(
      { review, revalidated: true },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err) {
    return createErrorResponse(err, 'api/reviews:POST');
  }
}
