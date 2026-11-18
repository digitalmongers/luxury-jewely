import { NextResponse } from 'next/server';
import { getCachedProductCatalog } from '@/src/lib/catalog';
import { createErrorResponse } from '@/src/lib/errors';

export const revalidate = 300;

export async function GET() {
  try {
    const data = await getCachedProductCatalog();
    const etag = `"virelle-${data.product.sku}-${data.cachedAt.slice(0, 13)}"`;

    return NextResponse.json(data, {
      status: 200,
      headers: {
        ETag: etag,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    return createErrorResponse(err, 'api/catalog');
  }
}
