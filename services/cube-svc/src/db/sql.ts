import { Client } from 'pg';

/**
 * One node-postgres Client per request, pointed at Hyperdrive's connection string.
 * Hyperdrive owns the upstream CockroachDB pool. See
 * https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/
 *
 * `prepare` is left at node-postgres' default (named prepared statements). Do not
 * disable them: Hyperdrive's transaction pooling mode does not reliably support
 * the extra describe round-trip some drivers send when prepared statements are off.
 */
export type Sql = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
  end(): Promise<void>;
};

export function createHyperdriveSql(connectionString: string): Sql {
  const client = new Client({ connectionString });
  let connected = false;

  return {
    async query<T>(text: string, params: unknown[] = []): Promise<T[]> {
      if (!connected) {
        await client.connect();
        connected = true;
      }
      const result = await client.query(text, params);
      return result.rows as T[];
    },
    async end() {
      if (!connected) return;
      connected = false;
      await client.end();
    }
  };
}
