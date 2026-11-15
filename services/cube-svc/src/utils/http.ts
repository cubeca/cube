import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/** Express `res.send(string)` uses text/html. The generated client treats a non-JSON body as text. */
export function text(c: Context, body: string, status: ContentfulStatusCode = 200): Response {
  return c.body(body, status, {
    'Content-Type': 'text/html; charset=utf-8'
  });
}

export async function readJsonBody(c: Context): Promise<Record<string, unknown> | null> {
  const raw = await c.req.text();
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function apiResultFromRow(row: {
  id?: string;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
  data?: Record<string, unknown> | null;
} | null | undefined): Record<string, unknown> {
  if (!row) {
    throw new Error('Missing database row');
  }
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.data ?? {})
  };
}
