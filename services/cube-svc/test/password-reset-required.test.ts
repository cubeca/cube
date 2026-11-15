import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app';
import type { Env } from '../src/env';
import type { Sql } from '../src/db/sql';
import { encryptString, readStoredBcryptHash } from '../src/utils/crypto';
import { signCubeJwt } from '../src/utils/jwt';
import { comparePassword, hashPassword } from '../src/utils/passwords';
import { PASSWORD_RESET_REQUIRED } from '../src/routes/identity';

const SECRET = 'secret';
const ENCRYPT = 'encrypt_secret';
const USER_ID = '6639b666-e890-4dfd-9964-6c8782b65733';

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

async function bearer(aud: string[], sub = '00000000-0000-0000-0000-000000000000'): Promise<string> {
  return signCubeJwt({ sub, aud }, SECRET, '4h');
}

function userRow(password: string) {
  return {
    id: USER_ID,
    name: 'Ada',
    email: 'ada@example.com',
    password,
    permission_ids: ['anonymous', 'active'],
    is_active: true,
    has_verified_email: true,
    has_accepted_terms: true,
    has_accepted_newsletter: false,
    profile_id: '',
    is_over_18: true
  };
}

describe('password reset required', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('treats a blob encrypted with another key as unreadable', async () => {
    const hash = await hashPassword('password123');
    const stored = encryptString(hash, 'old-secret');
    expect(readStoredBcryptHash(stored, 'old-secret')).toBe(hash);
    expect(readStoredBcryptHash(stored, ENCRYPT)).toBeNull();
    expect(readStoredBcryptHash(encryptString('not-a-hash', ENCRYPT), ENCRYPT)).toBeNull();
  });

  it('sends the reset email and returns PASSWORD_RESET_REQUIRED when the stored password cannot be decrypted', async () => {
    const fetchMock = vi.fn(async (_url: unknown, _init?: RequestInit) => new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const stored = encryptString(await hashPassword('password123'), 'old-secret');
    const app = createApp({
      sql: fakeSql((text) => (text.includes('"users"') ? [userRow(stored)] : []))
    });

    const response = await app.request(
      '/auth/login',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${await bearer(['anonymous'])}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ada@example.com', password: 'password123' })
      },
      testEnv()
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ code: PASSWORD_RESET_REQUIRED });
    expect(fetchMock).toHaveBeenCalledOnce();
    const sent = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(sent.templateId).toBe(4);
    expect(sent.params.PASSWORD_CHANGE_URL).toContain('https://www-dev.cubecommons.ca/reset-password/');
  });

  it('does not send a reset email for an unknown address or a wrong password', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const stored = encryptString(await hashPassword('password123'), ENCRYPT);
    const app = createApp({
      sql: fakeSql((text, params) => {
        if (!text.includes('"users"')) return [];
        if (params[0] === 'ada@example.com') return [userRow(stored)];
        return [];
      })
    });
    const headers = { Authorization: `Bearer ${await bearer(['anonymous'])}`, 'Content-Type': 'application/json' };

    const missing = await app.request(
      '/auth/login',
      { method: 'POST', headers, body: JSON.stringify({ email: 'missing@example.com', password: 'password123' }) },
      testEnv()
    );
    expect(missing.status).toBe(403);
    expect(await missing.text()).toBe('Invalid email or password');

    const wrong = await app.request(
      '/auth/login',
      { method: 'POST', headers, body: JSON.stringify({ email: 'ada@example.com', password: 'not-the-password' }) },
      testEnv()
    );
    expect(wrong.status).toBe(403);
    expect(await wrong.text()).toBe('Invalid email or password');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requires a reset when change-password cannot read the current hash, and a reset token stores the new key', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const updates: unknown[][] = [];
    const oldBlob = encryptString(await hashPassword('password123'), 'old-secret');
    let stored = oldBlob;
    const app = createApp({
      sql: fakeSql((text, params) => {
        if (text.startsWith('UPDATE') && text.includes('password')) {
          updates.push(params);
          stored = String(params[1]);
          return [{ id: USER_ID }];
        }
        if (text.includes('"users"')) return [userRow(stored)];
        return [];
      })
    });

    const active = await bearer(['active'], USER_ID);
    const rejected = await app.request(
      '/auth/password',
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${active}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: 'password123', newPassword: 'newpassword1' })
      },
      testEnv()
    );
    expect(rejected.status).toBe(403);
    expect(await rejected.json()).toEqual({ code: PASSWORD_RESET_REQUIRED });
    expect(updates).toHaveLength(0);

    const resetToken = await bearer(['password-reset'], USER_ID);
    const accepted = await app.request(
      '/auth/password',
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${resetToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: 'newpassword1' })
      },
      testEnv()
    );
    expect(accepted.status).toBe(200);
    expect(await accepted.text()).toBe('OK');
    const rewritten = String(updates[0]?.[1]);
    const hash = readStoredBcryptHash(rewritten, ENCRYPT);
    expect(hash).toBeTruthy();
    expect(await comparePassword('newpassword1', hash as string)).toBe(true);
    expect(readStoredBcryptHash(rewritten, 'old-secret')).toBeNull();
  });
});
