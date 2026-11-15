import { SignJWT } from 'jose';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, FRONTEND_ORIGINS } from '../src/app';
import type { Env } from '../src/env';
import type { Sql } from '../src/db/sql';
import { decryptString } from '../src/utils/crypto';
import { comparePassword } from '../src/utils/passwords';
import { decodeUuidBase36 } from '../src/utils/uuid';

const SECRET = 'secret';
const ENCRYPT = 'encrypt_secret';

function testEnv(): Env {
  return {
    HYPERDRIVE: { connectionString: 'postgres://hyperdrive.local/cube' } as Hyperdrive,
    R2_BUCKET: { delete: async () => undefined } as unknown as R2Bucket,
    HOST: 'https://www-dev.cubecommons.ca',
    CUBE_SVC_HOST: 'https://cube-svc-dev.cubecommons.ca',
    DB_SCHEMA: 'cube',
    CLOUDFLARE_ACCOUNT_ID: 'account',
    CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN: 'customer.example',
    CLOUDFLARE_R2_BUCKET_NAME: 'cubecommons-dev',
    CLOUDFLARE_R2_PUBLIC_BUCKET_BASE_URL: 'https://files.example',
    ENCRYPT_SECRET: ENCRYPT,
    JWT_TOKEN_SECRET: SECRET,
    BREVO_API_KEY: 'brevo',
    CONTACT_US_EMAIL: 'contact@example.com',
    REPORT_ABUSE_EMAIL: 'abuse@example.com',
    NOTIFICATION_EMAIL: 'notify@example.com',
    CLOUDFLARE_API_TOKEN: 'cf',
    CLOUDFLARE_R2_ACCESS_KEY_ID: 'key',
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: 'secret-key'
  };
}

function fakeSql(handler: (text: string, params: unknown[]) => unknown[]): Sql {
  return {
    async query(text, params = []) {
      return handler(text, params) as never;
    },
    async end() {}
  };
}

async function anonymousToken(): Promise<string> {
  return new SignJWT({ iss: 'CUBE', sub: '00000000-0000-0000-0000-000000000000', aud: ['anonymous'] })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('4h')
    .sign(new TextEncoder().encode(SECRET));
}

describe('routes', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('serves the health check and 404s the decommissioned VTT routes', async () => {
    const app = createApp({ sql: fakeSql(() => []) });
    const health = await app.request('/', {}, testEnv());
    expect(health.status).toBe(200);
    expect(await health.text()).toBe('Service is running');

    const vtt = await app.request('/vtt/11111111-1111-4111-8111-111111111111', {}, testEnv());
    expect(vtt.status).toBe(404);
    const put = await app.request('/vtt/11111111-1111-4111-8111-111111111111', { method: 'PUT' }, testEnv());
    expect(put.status).toBe(404);
  });

  it('reflects the dev and prod frontend origins', async () => {
    const app = createApp({ sql: fakeSql(() => []) });
    for (const origin of FRONTEND_ORIGINS) {
      const response = await app.request(
        '/search',
        { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization' } },
        testEnv()
      );
      expect(response.headers.get('access-control-allow-origin')).toBe(origin);
    }
  });

  it('rejects protected routes without a token', async () => {
    const app = createApp({ sql: fakeSql(() => []) });
    const response = await app.request('/profiles', {}, testEnv());
    expect(response.status).toBe(403);
  });

  it('logs in with an existing bcrypt hash wrapped by CryptoJS', async () => {
    const { hashPassword } = await import('../src/utils/passwords');
    const { encryptString } = await import('../src/utils/crypto');
    const password = await hashPassword('password123');
    const stored = encryptString(password, ENCRYPT);
    const userId = '6639b666-e890-4dfd-9964-6c8782b65733';
    const app = createApp({
      sql: fakeSql((text) => {
        if (text.includes('"users"')) {
          return [{
            id: userId,
            name: 'Ada',
            email: 'ada@example.com',
            password: stored,
            permission_ids: ['anonymous', 'active'],
            is_active: true,
            has_verified_email: true,
            has_accepted_terms: true,
            has_accepted_newsletter: false,
            profile_id: '',
            is_over_18: true
          }];
        }
        return [];
      })
    });
    const response = await app.request(
      '/auth/login',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${await anonymousToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ada@example.com', password: 'password123' })
      },
      testEnv()
    );
    expect(response.status).toBe(200);
    const body = await response.json() as { jwt: string; user: { uuid: string; isOver18: boolean } };
    expect(body.user.uuid).toBe(userId);
    expect(body.user.isOver18).toBe(true);
    const { verifyCubeJwt } = await import('../src/utils/jwt');
    const payload = await verifyCubeJwt(body.jwt, SECRET);
    expect(payload.aud).toEqual(['anonymous', 'active']);
    expect(await comparePassword('password123', decryptString(stored, ENCRYPT))).toBe(true);
  });

  it('keeps vttFileUrl on content responses and does not publish captions', async () => {
    const contentId = '11111111-1111-4111-8111-111111111111';
    const vttId = '22222222-2222-4222-8222-222222222222';
    const app = createApp({
      sql: fakeSql((text, params) => {
        if (text.includes('"content"')) {
          return [{
            id: contentId,
            created_at: '2026-01-01T00:00:00.000Z',
            updated_at: '2026-01-01T00:00:00.000Z',
            data: { title: 'Piece', profileId: 'p', vttFileId: vttId, vttLanguage: 'en', collaborators: [] }
          }];
        }
        if (text.includes('"files"') && params[0] === vttId) {
          return [{
            id: vttId,
            storage_type: 'cloudflareR2',
            created_at: '2026-01-01T00:00:00.000Z',
            updated_at: '2026-01-01T00:00:00.000Z',
            data: { filePathInBucket: `${vttId}/captions.vtt` }
          }];
        }
        return [];
      })
    });
    const response = await app.request(`/content/${contentId}`, {}, testEnv());
    expect(response.status).toBe(200);
    const body = await response.json() as { title: string; vttLanguage: string; vttFileUrl: { playerInfo: { publicUrl: string } }; vttFileId?: string };
    expect(body.title).toBe('Piece');
    expect(body.vttLanguage).toBe('en');
    expect(body.vttFileId).toBeUndefined();
    expect(body.vttFileUrl.playerInfo.publicUrl).toBe(`https://files.example/${vttId}/captions.vtt`);
  });

  it('creates a user and stores the newsletter flag in has_accepted_terms, matching the current route', async () => {
    const inserts: unknown[][] = [];
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 201 })));
    const app = createApp({
      sql: fakeSql((text, params) => {
        if (text.startsWith('INSERT INTO "cube"."users"')) {
          inserts.push(params);
          return [{
            id: '33333333-3333-4333-8333-333333333333',
            name: params[0],
            email: params[1],
            password: params[3],
            permission_ids: params[4],
            is_active: false,
            has_verified_email: false,
            has_accepted_terms: params[5],
            has_accepted_newsletter: params[6],
            profile_id: params[2],
            is_over_18: params[7]
          }];
        }
        return [];
      })
    });
    const response = await app.request(
      '/auth/user',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${await anonymousToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ada Lovelace',
          email: 'Ada@Example.com',
          password: 'password123',
          hasAcceptedNewsletter: false,
          hasAcceptedTerms: true,
          isOver18: true
        })
      },
      testEnv()
    );
    expect(response.status).toBe(201);
    const body = await response.json() as { id: string; jwt: string };
    expect(body.id).toBe('33333333-3333-4333-8333-333333333333');
    expect(inserts[0]?.[5]).toBe(false);
    expect(inserts[0]?.[6]).toBe(true);
    const payload = await (await import('../src/utils/jwt')).verifyCubeJwt(body.jwt, SECRET);
    expect(payload.aud).toEqual(['unverified']);
    expect(decodeUuidBase36(payload.sub)).toBe(body.id);
    const fetchMock = vi.mocked(fetch);
    const call = fetchMock.mock.calls[0];
    expect(String(call?.[0])).toBe('https://api.brevo.com/v3/smtp/email');
    const sent = JSON.parse(String(call?.[1]?.body));
    expect(sent.templateId).toBe(2);
    expect(sent.params.EMAIL_VERIFICATION_URL).toContain(`https://cube-svc-dev.cubecommons.ca/auth/email/verify/${body.jwt}`);
  });
});
