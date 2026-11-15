/**
 * One-time migration: re-encrypt cube.users.password from OLD_ENCRYPT_SECRET to
 * NEW_ENCRYPT_SECRET. The stored value is CryptoJS OpenSSL AES around a bcrypt hash.
 * The bcrypt hash itself is not changed, so the user's password stays the same.
 *
 * Dry-run unless --apply is passed. Nothing is printed except counts and user ids.
 *
 *   OLD_ENCRYPT_SECRET=... NEW_ENCRYPT_SECRET=... COCKROACH_DB_CONNECTION_STRING=... \
 *     node scripts/reencrypt-passwords.mjs
 *   ... node scripts/reencrypt-passwords.mjs --apply
 */
import CryptoJS from 'crypto-js';
import pg from 'pg';

const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function readStoredBcryptHash(ciphertext, secret) {
  if (!ciphertext || !secret) return null;
  try {
    const plain = CryptoJS.AES.decrypt(String(ciphertext), secret).toString(CryptoJS.enc.Utf8);
    return BCRYPT_HASH.test(plain) ? plain : null;
  } catch {
    return null;
  }
}

function encryptString(value, secret) {
  return CryptoJS.AES.encrypt(value, secret).toString();
}

function schemaName() {
  const schema = process.env.DB_SCHEMA || 'cube';
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
    throw new Error('DB_SCHEMA must be a plain identifier');
  }
  return schema;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const oldSecret = process.env.OLD_ENCRYPT_SECRET || '';
  const newSecret = process.env.NEW_ENCRYPT_SECRET || '';
  const connectionString = process.env.COCKROACH_DB_CONNECTION_STRING || '';
  if (!oldSecret || !newSecret || !connectionString) {
    console.error('Set OLD_ENCRYPT_SECRET, NEW_ENCRYPT_SECRET, and COCKROACH_DB_CONNECTION_STRING.');
    process.exitCode = 1;
    return;
  }

  const schema = schemaName();
  const client = new pg.Client({ connectionString });
  await client.connect();
  try {
    const { rows } = await client.query(`SELECT id, password FROM "${schema}"."users"`);
    const readable = [];
    const unreadable = [];
    for (const row of rows) {
      const hash = readStoredBcryptHash(row.password, oldSecret);
      if (!hash) {
        unreadable.push(row.id);
        continue;
      }
      const next = encryptString(hash, newSecret);
      if (readStoredBcryptHash(next, newSecret) !== hash) {
        throw new Error(`Refusing to write a blob that does not decrypt for user ${row.id}`);
      }
      readable.push({ id: row.id, next });
    }

    if (apply) {
      for (const row of readable) {
        await client.query(`UPDATE "${schema}"."users" SET password = $2 WHERE id = $1`, [row.id, row.next]);
      }
    }

    console.log(
      JSON.stringify({
        dryRun: !apply,
        schema,
        users: rows.length,
        reencrypted: apply ? readable.length : 0,
        wouldReencrypt: readable.length,
        unreadable: unreadable.length,
        unreadableIds: unreadable
      })
    );
    if (!apply) {
      console.log('Dry run only. Re-run with --apply to write.');
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
