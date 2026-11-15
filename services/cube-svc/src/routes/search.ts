import type { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { allowIfAnyOf } from '../middleware/auth';
import * as contentDb from '../db/queries/content';
import * as playlistDb from '../db/queries/playlist';
import * as profileDb from '../db/queries/profile';
import { apiResultFromRow, transformContent, transformPlaylistSimple } from '../services/transform';
import { dottedFilters, parseRequestQuery, queryInt, queryString } from '../utils/query';

function schemaOf(env: { DB_SCHEMA?: string }): string {
  return env.DB_SCHEMA || 'cube';
}

type ServiceResult = { status: number | null; data: unknown; error: string | null; meta: unknown };

export function registerSearch(app: Hono<AppEnv>): void {
  app.get('/search', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const query = parseRequestQuery(c.req.url);
    const scope = queryString(query.scope) || undefined;
    const offset = queryInt(query.offset, 0);
    const limit = queryInt(query.limit, 10);
    const searchTerm = queryString(query.searchTerm);
    const filters = dottedFilters(query);
    const sql = c.get('sql');
    const schema = schemaOf(c.env);
    const meta = { offset, limit, filters };

    const contentResult: ServiceResult = { status: null, data: null, error: null, meta: null };
    const profileResult: ServiceResult = { status: null, data: null, error: null, meta: null };
    const playlistResult: ServiceResult = { status: null, data: null, error: null, meta: null };

    if (!scope || scope === 'content') {
      try {
        const rows = await contentDb.searchContent(sql, schema, offset, limit, filters, searchTerm);
        contentResult.meta = meta;
        contentResult.status = 200;
        contentResult.data = await transformContent(sql, schema, c.env, rows.map((row) => apiResultFromRow(row)));
      } catch (error) {
        contentResult.status = 500;
        contentResult.error = error instanceof Error ? error.message : String(error);
      }
    }

    if (!scope || scope === 'profile') {
      try {
        profileResult.meta = meta;
        profileResult.status = 200;
        profileResult.data = await profileDb.searchProfiles(sql, schema, offset, limit, searchTerm);
      } catch (error) {
        profileResult.status = 500;
        profileResult.error = error instanceof Error ? error.message : String(error);
      }
    }

    if (!scope || scope === 'playlist') {
      try {
        const rows = await playlistDb.searchPlaylist(sql, schema, offset, limit, filters, searchTerm);
        playlistResult.meta = meta;
        playlistResult.status = 200;
        playlistResult.data = await transformPlaylistSimple(sql, schema, c.env, rows.map((row) => apiResultFromRow(row)));
      } catch (error) {
        playlistResult.status = 500;
        playlistResult.error = error instanceof Error ? error.message : String(error);
      }
    }

    const response: Record<string, unknown> = {};
    if (!scope || scope === 'content') {
      response.contentResults = { meta: contentResult.meta, data: contentResult.data, status: contentResult.status, error: contentResult.error };
    }
    if (!scope || scope === 'profile') {
      response.profileResults = { meta: profileResult.meta, data: profileResult.data, status: profileResult.status, error: profileResult.error };
    }
    if (!scope || scope === 'playlist') {
      response.playlistResults = { meta: playlistResult.meta, data: playlistResult.data, status: playlistResult.status, error: playlistResult.error };
    }
    return c.json(response);
  });
}
