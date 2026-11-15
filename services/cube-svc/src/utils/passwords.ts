import bcrypt from 'bcryptjs';

/**
 * bcryptjs is pure JS and verifies hashes produced by native bcrypt ($2a$ and $2b$).
 * New hashes are rewritten to the $2b$ prefix native bcrypt 5 writes, with the same cost (10).
 */
export async function hashPassword(password: string): Promise<string> {
  const hashed = await bcrypt.hash(password, 10);
  return hashed.replace(/^\$2a\$/, '$2b$');
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
