import { jwtVerify, SignJWT } from 'jose';

export type CubeJwtPayload = {
  sub: string;
  aud: string[];
  iss: string;
};

export class InvalidTokenError extends Error {
  constructor() {
    super('Invalid token');
    this.name = 'InvalidTokenError';
  }
}

export class MalformedTokenError extends Error {
  constructor() {
    super('Malformed token');
    this.name = 'MalformedTokenError';
  }
}

function signingKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export function isCubeJwtPayload(value: unknown): value is CubeJwtPayload {
  if (!value || typeof value !== 'object') return false;
  const token = value as { sub?: unknown; aud?: unknown; iss?: unknown };
  return (
    typeof token.sub === 'string' &&
    token.sub !== '' &&
    Array.isArray(token.aud) &&
    token.aud.length > 0 &&
    token.aud.every((entry) => typeof entry === 'string' && entry !== '') &&
    token.iss === 'CUBE'
  );
}

/** HS256 JWT with the same claims jsonwebtoken wrote: iss, sub, aud, iat, exp. */
export async function signCubeJwt(
  claims: { sub: string; aud: string[] },
  secret: string,
  expiresIn: string
): Promise<string> {
  return await new SignJWT({ iss: 'CUBE', sub: claims.sub, aud: claims.aud })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(signingKey(secret));
}

export async function verifyCubeJwt(token: string, secret: string): Promise<CubeJwtPayload> {
  let payload: unknown;
  try {
    const verified = await jwtVerify(token, signingKey(secret), { algorithms: ['HS256'] });
    payload = verified.payload;
  } catch {
    throw new InvalidTokenError();
  }

  if (!isCubeJwtPayload(payload)) {
    throw new MalformedTokenError();
  }

  return payload;
}
