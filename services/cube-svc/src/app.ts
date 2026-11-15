import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppEnv } from './app-env';
import type { Sql } from './db/sql';
import { createHyperdriveSql } from './db/sql';
import { text } from './utils/http';
import { registerCloudflare } from './routes/cloudflare';
import { registerContent } from './routes/content';
import { registerIdentity } from './routes/identity';
import { registerPlaylist } from './routes/playlist';
import { registerProfile } from './routes/profile';
import { registerSearch } from './routes/search';

/** Frontends that already call this API. CORS still reflects every Origin, matching the old `cors()` middleware. */
export const FRONTEND_ORIGINS = [
  'https://cubecommons.ca',
  'https://www.cubecommons.ca',
  'https://www-dev.cubecommons.ca',
  'https://www-main.cubecommons.ca',
  'http://localhost:3000',
  'http://localhost:8080'
];

export function createApp(options?: { sql?: Sql }) {
  const app = new Hono<AppEnv>();

  app.use(
    '*',
    cors({
      origin: (origin) => origin || '*',
      allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'Upload-Length', 'Upload-Metadata', 'Tus-Resumable', 'Upload-Offset', 'X-Requested-With'],
      exposeHeaders: ['Location']
    })
  );

  app.use('*', async (c, next) => {
    if (options?.sql) {
      c.set('sql', options.sql);
      await next();
      return;
    }

    let inner: Sql | undefined;
    const sql: Sql = {
      async query(textSql, params) {
        if (!inner) inner = createHyperdriveSql(c.env.HYPERDRIVE.connectionString);
        return inner.query(textSql, params);
      },
      async end() {
        if (inner) await inner.end();
      }
    };
    c.set('sql', sql);
    try {
      await next();
    } finally {
      const done = sql.end();
      if (c.executionCtx) c.executionCtx.waitUntil(done);
      else await done;
    }
  });

  // Same mount order as the Express app.
  registerCloudflare(app);
  registerProfile(app);
  registerIdentity(app);
  registerContent(app);
  registerPlaylist(app);
  registerSearch(app);

  app.get('/', (c) => text(c, 'Service is running'));

  app.notFound((c) => text(c, 'Not Found', 404));
  app.onError((error, c) => {
    console.error(error);
    return text(c, 'Internal Server Error', 500);
  });

  return app;
}
