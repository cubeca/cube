import { describe, expect, it } from 'vitest';
import type { Env } from '../src/env';
import { presignPut } from '../src/services/r2';

const env = {
  CLOUDFLARE_ACCOUNT_ID: 'account',
  CLOUDFLARE_R2_BUCKET_NAME: 'cubecommons-dev',
  CLOUDFLARE_R2_ACCESS_KEY_ID: 'key',
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: 'secret-key'
} as Env;

describe('R2 presign', () => {
  it('returns an S3 SigV4 PUT url for the same bucket and object key', async () => {
    const url = new URL(await presignPut(env, 'file id/cover.png', 'image/png', 300));
    expect(url.origin).toBe('https://account.r2.cloudflarestorage.com');
    expect(decodeURIComponent(url.pathname)).toBe('/cubecommons-dev/file id/cover.png');
    expect(url.searchParams.get('X-Amz-Expires')).toBe('300');
    expect(url.searchParams.get('X-Amz-Algorithm')).toBe('AWS4-HMAC-SHA256');
    expect(url.searchParams.get('X-Amz-Signature')).toBeTruthy();
  });
});
