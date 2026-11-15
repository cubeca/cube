import CryptoJS from 'crypto-js';

/**
 * CryptoJS OpenSSL-compatible salted AES (EVP_BytesToKey / MD5, AES-256-CBC).
 * Ciphertexts already stored by the Express service decrypt with the same secret.
 */
export function encryptString(value: string, secret: string): string {
  return CryptoJS.AES.encrypt(value, secret).toString();
}

export function decryptString(value: string, secret: string): string {
  return CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8);
}

/** bcrypt hashes written by bcrypt and bcryptjs ($2a$, $2b$, $2y$). */
const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

/**
 * Decrypt a stored password blob and return the bcrypt hash.
 * A wrong ENCRYPT_SECRET makes CryptoJS return an empty string or throw on
 * malformed UTF-8. Either case, and any plaintext that is not a bcrypt hash,
 * is unreadable rather than a wrong password.
 */
export function readStoredBcryptHash(ciphertext: string, secret: string): string | null {
  if (!ciphertext || !secret) return null;
  let plain = '';
  try {
    plain = decryptString(ciphertext, secret);
  } catch {
    return null;
  }
  if (!BCRYPT_HASH.test(plain)) return null;
  return plain;
}
