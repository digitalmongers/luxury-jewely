import { NextResponse } from 'next/server';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, string>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export async function parseJsonBody<T = Record<string, unknown>>(request: Request): Promise<T> {
  try {
    const body = (await request.json()) as T;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new ApiError(400, 'INVALID_PAYLOAD', 'Expected a JSON object payload.');
    }
    return body;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, 'MALFORMED_JSON', 'Unable to parse JSON request body.');
  }
}

export function createErrorResponse(err: unknown, contextLabel = 'api'): NextResponse {
  const requestId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  if (err instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: err.code,
          message: err.message,
          requestId,
          ...(err.details ? { details: err.details } : {}),
        },
      },
      {
        status: err.statusCode,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${contextLabel}:${requestId}]`, err);
  }

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected server error occurred. Please try again.',
        requestId,
      },
    },
    {
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
