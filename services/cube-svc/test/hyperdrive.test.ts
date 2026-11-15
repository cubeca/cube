import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  configs: [] as { connectionString: string }[],
  connect: vi.fn(async () => undefined),
  query: vi.fn(async (..._args: unknown[]) => ({ rows: [{ ok: true }] })),
  end: vi.fn(async () => undefined)
}));

vi.mock('pg', () => ({
  Client: class {
    constructor(config: { connectionString: string }) {
      mocks.configs.push(config);
    }
    connect() {
      return mocks.connect();
    }
    query(text: string, params?: unknown[]) {
      return mocks.query(text, params);
    }
    end() {
      return mocks.end();
    }
  }
}));

import { createHyperdriveSql } from '../src/db/sql';

describe('Hyperdrive client', () => {
  beforeEach(() => {
    mocks.configs.length = 0;
    mocks.connect.mockClear();
    mocks.query.mockClear();
    mocks.end.mockClear();
  });

  it('gives node-postgres the Hyperdrive connection string', async () => {
    const connectionString = 'postgres://hyperdrive.local/cube?sslmode=disable';
    const sql = createHyperdriveSql(connectionString);
    const rows = await sql.query('SELECT 1 AS ok', []);
    expect(mocks.configs[0]?.connectionString).toBe(connectionString);
    expect(mocks.connect).toHaveBeenCalledOnce();
    expect(mocks.query).toHaveBeenCalledWith('SELECT 1 AS ok', []);
    expect(rows).toEqual([{ ok: true }]);
    await sql.end();
    expect(mocks.end).toHaveBeenCalledOnce();
  });
});
