import { Buffer } from 'node:buffer';

export function base64encode(value: unknown): string {
  return Buffer.from(String(value), 'utf8').toString('base64');
}

export function base64decode(value: unknown): string | undefined {
  try {
    return Buffer.from(String(value), 'base64').toString('utf8');
  } catch {
    return undefined;
  }
}

export function parseTusUploadMetadata(headerValues: string | string[]): Record<string, string | true> {
  const parsed: Record<string, string | true> = {};
  const headers = Array.isArray(headerValues) ? headerValues : [headerValues];
  for (const headerValue of headers) {
    for (const piece of headerValue.split(',')) {
      const [metaName, metaValue] = piece.split(' ');
      if (metaName) {
        parsed[metaName] = !metaValue ? true : (base64decode(metaValue) ?? '');
      }
    }
  }
  return parsed;
}

export function makeCloudflareTusUploadMetadata(meta: {
  reserveDurationSeconds?: number;
  isPrivate?: boolean;
  urlValidDurationSeconds?: number;
  uploadingUserId?: string;
} = {}): string {
  const fields: Record<string, string | number | true> = {};
  if (meta.reserveDurationSeconds) fields.maxDurationSeconds = meta.reserveDurationSeconds;
  if (meta.isPrivate) fields.requiresignedurls = true;
  if (meta.urlValidDurationSeconds) {
    fields.expiry = new Date(Date.now() + meta.urlValidDurationSeconds * 1000).toISOString();
  }
  if (meta.uploadingUserId) fields.creator = `user:${meta.uploadingUserId}`;

  const serialized: string[] = [];
  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    serialized.push(fieldValue === true ? fieldName : `${fieldName} ${base64encode(fieldValue)}`);
  }
  return serialized.join(',');
}
