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
