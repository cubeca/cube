const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Same base36 UUID codec as the `uuid-encoder` package (`new UuidEncoder('base36')`).
 * Signup and password-reset tokens store the user id in this form.
 */
export function encodeUuidBase36(uuid: string): string {
  const hex = uuid.replace(/-/g, '').toLowerCase();
  let value = BigInt(`0x${hex}`);
  if (value === 0n) return '0';

  let encoded = '';
  const base = 36n;
  while (value > 0n) {
    encoded = BASE36[Number(value % base)] + encoded;
    value /= base;
  }
  return encoded;
}

export function decodeUuidBase36(value: string): string {
  let decoded = 0n;
  const base = 36n;
  const text = value.toLowerCase();

  for (const character of text) {
    const digit = BASE36.indexOf(character);
    if (digit < 0) {
      throw new Error('Invalid encoded data');
    }
    decoded = decoded * base + BigInt(digit);
  }

  const hex = decoded.toString(16).padStart(32, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function canonicalUuid(value: string): string {
  if (UUID_REGEXP.test(value)) return value;
  return decodeUuidBase36(value);
}
