import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { ApiError, createErrorResponse, parseJsonBody } from '@/src/lib/errors';
import { validateRevalidateInput } from '@/src/lib/validation';

export async function POST(request: Request) {
  try {
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (expectedSecret) {
      const provided = request.headers.get('x-revalidate-token');
      if (provided !== expectedSecret) {
        throw new ApiError(401, 'UNAUTHORIZED', 'Invalid revalidation token.');
      }
    }

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const { tags, paths } = validateRevalidateInput(body);

    for (const tag of tags) {
      revalidateTag(tag, 'max');
    }

    for (const p of paths) {
      revalidatePath(p);
    }

    return NextResponse.json(
      {
        revalidated: true,
        tags,
        paths,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err) {
    return createErrorResponse(err, 'api/revalidate:POST');
  }
}
