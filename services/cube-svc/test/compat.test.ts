import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { decryptString, encryptString } from '../src/utils/crypto';
import { verifyCubeJwt, signCubeJwt } from '../src/utils/jwt';
import { comparePassword, hashPassword } from '../src/utils/passwords';
import { decodeUuidBase36, encodeUuidBase36 } from '../src/utils/uuid';

const require = createRequire(import.meta.url);
const UuidEncoder = require('uuid-encoder');

describe('stored secret compatibility', () => {
  it('round-trips CryptoJS OpenSSL AES and decrypts a known ciphertext', async () => {
    const secret = 'encrypt_secret';
    const stored = encryptString('hello', secret);
    expect(stored.startsWith('U2FsdGVkX1')).toBe(true);
    expect(decryptString(stored, secret)).toBe('hello');
    expect(CryptoJS.AES.decrypt(stored, secret).toString(CryptoJS.enc.Utf8)).toBe('hello');

    const fixture = CryptoJS.AES.encrypt('$2b$10$examplehash', secret).toString();
    expect(decryptString(fixture, secret)).toBe('$2b$10$examplehash');
  });

  it('verifies a native bcrypt $2b$ hash and writes $2b$ hashes', async () => {
    const known = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    expect(await comparePassword('password', known)).toBe(true);
    expect(await comparePassword('nope', known)).toBe(false);
    const fresh = await hashPassword('cube-commons');
    expect(fresh.startsWith('$2b$10$')).toBe(true);
    expect(await comparePassword('cube-commons', fresh)).toBe(true);
  });

  it('accepts jsonwebtoken HS256 tokens and produces tokens jsonwebtoken accepts', async () => {
    const secret = 'secret';
    const issued = jwt.sign({ iss: 'CUBE', sub: 'user-1', aud: ['anonymous', 'active'] }, secret, { expiresIn: '14d' });
    const verified = await verifyCubeJwt(issued, secret);
    expect(verified.sub).toBe('user-1');
    expect(verified.aud).toEqual(['anonymous', 'active']);
    expect(verified.iss).toBe('CUBE');

    const ours = await signCubeJwt({ sub: 'user-2', aud: ['unverified'] }, secret, '7d');
    const decoded = jwt.verify(ours, secret) as { sub: string; aud: string[]; iss: string };
    expect(decoded.sub).toBe('user-2');
    expect(decoded.aud).toEqual(['unverified']);
    expect(decoded.iss).toBe('CUBE');
  });

  it('matches uuid-encoder base36', () => {
    const encoder = new UuidEncoder('base36');
    const samples = [
      '00000000-0000-0000-0000-000000000000',
      '6639b666-e890-4dfd-9964-6c8782b65733',
      'ffffffff-ffff-ffff-ffff-ffffffffffff'
    ];
    for (const uuid of samples) {
      expect(encodeUuidBase36(uuid)).toBe(encoder.encode(uuid));
      expect(decodeUuidBase36(encoder.encode(uuid)).toLowerCase()).toBe(uuid);
    }
  });
});
