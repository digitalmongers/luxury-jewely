import { NextResponse } from 'next/server';
import { computeDeliveryEstimate } from '@/src/lib/catalog';
import { createErrorResponse, parseJsonBody } from '@/src/lib/errors';
import { validatePostalCode } from '@/src/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<Record<string, unknown>>(request);
    const postalCode = validatePostalCode(body.postalCode);
    const estimate = computeDeliveryEstimate(postalCode);

    return NextResponse.json(
      { estimate },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=300',
        },
      }
    );
  } catch (err) {
    return createErrorResponse(err, 'api/shipping:POST');
  }
}
