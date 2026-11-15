import qs from 'qs';

/**
 * Express uses the `qs` extended parser. Dotted keys such as `filters.category`
 * stay as a single key (that is what the generated API client sends). Bracket keys
 * such as `filters[category]` become a nested object.
 */
export function parseRequestQuery(url: string): Record<string, unknown> {
  const search = new URL(url).search;
  const parsed = qs.parse(search, { ignoreQueryPrefix: true });
  return parsed as Record<string, unknown>;
}

export function queryString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((entry) => String(entry)).join(',');
  if (value === undefined || value === null) return '';
  return String(value);
}

export function queryInt(value: unknown, fallback: number): number {
  const parsed = parseInt(queryString(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed || fallback;
}

/** Comma-separated string or repeated query params, matching the search handlers. */
export function commaList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => String(entry).split(',')).map((entry) => entry.trim());
  }
  if (typeof value === 'string') {
    return value.split(',').map((entry) => entry.trim());
  }
  return [];
}

export function dottedFilters(query: Record<string, unknown>): Record<string, unknown> {
  const filters: Record<string, unknown> = {};
  for (const key of Object.keys(query)) {
    if (key.startsWith('filters.')) {
      filters[key.slice('filters.'.length)] = query[key];
    }
  }
  return filters;
}

export function nestedRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}
