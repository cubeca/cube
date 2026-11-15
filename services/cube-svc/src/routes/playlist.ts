import type { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { allowIfAnyOf, extractUser } from '../middleware/auth';
import * as playlistDb from '../db/queries/playlist';
import { apiResultFromRow, transformPlaylist } from '../services/transform';
import { readJsonBody, text } from '../utils/http';
import { parseRequestQuery, queryInt, queryString } from '../utils/query';
import { UUID_REGEXP } from '../utils/uuid';

function schemaOf(env: { DB_SCHEMA?: string }): string {
  return env.DB_SCHEMA || 'cube';
}

export function registerPlaylist(app: Hono<AppEnv>): void {
  app.get('/playlist/:playlistId', async (c) => {
    const playlistId = c.req.param('playlistId');
    if (!playlistId) return text(c, 'Invalid playlist Id', 400);
    if (!UUID_REGEXP.test(playlistId)) return text(c, 'Invalid parameter, must be in UUID format.', 400);
    const row = await playlistDb.getPlaylistById(c.get('sql'), schemaOf(c.env), playlistId);
    if (!row) return text(c, 'Playlist not found', 404);
    const transformed = await transformPlaylist(c.get('sql'), schemaOf(c.env), c.env, [row]);
    return c.json(transformed);
  });

  app.get('/playlist', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const query = parseRequestQuery(c.req.url);
    const offset = queryInt(query.offset, 0);
    const limit = queryInt(query.limit, 10);
    const profileId = queryString(query.profileId);
    const userId = queryString(query.userId);
    const rows = await playlistDb.listPlaylistsByProfileOrUserId(
      c.get('sql'),
      schemaOf(c.env),
      offset,
      limit,
      profileId || undefined,
      userId || undefined
    );
    return c.json(await transformPlaylist(c.get('sql'), schemaOf(c.env), c.env, rows));
  });

  app.post('/playlist', allowIfAnyOf('active'), async (c) => {
    try {
      const body = await readJsonBody(c);
      if (!body) return text(c, 'Invalid JSON', 400);
      const user = extractUser(c);
      const playlistData: Record<string, unknown> = { ...body };
      delete playlistData.profileId;
      if (Object.keys(playlistData).length === 0) return text(c, 'Invalid request body', 400);
      const created = await playlistDb.insertPlaylist(c.get('sql'), schemaOf(c.env), {
        userId: user.uuid,
        profileId: body.profileId,
        ...playlistData
      });
      return c.json(apiResultFromRow(created), 201);
    } catch (error) {
      console.error('Error creating the playlist', error);
      return text(c, 'Error creating the playlist', 500);
    }
  });

  app.post('/playlist/addContent/:playlistId', allowIfAnyOf('active'), async (c) => {
    try {
      const body = await readJsonBody(c);
      if (!body) return text(c, 'Invalid JSON', 400);
      const playlistId = c.req.param('playlistId');
      const contentId = typeof body.contentId === 'string' ? body.contentId : '';
      if (!playlistId || !contentId) return text(c, 'Invalid request body or parameters', 400);
      const user = extractUser(c);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const allowed = await playlistDb.isUserAssociatedToPlaylist(sql, schema, user.uuid, playlistId);
      if (!allowed) return text(c, 'User does not have permission to update playlist', 403);
      const updated = await playlistDb.addContentToPlaylist(sql, schema, playlistId, contentId);
      if (!updated) return text(c, 'Error adding content to the playlist', 500);
      return c.json(apiResultFromRow(updated));
    } catch (error) {
      console.error('Error adding content to the playlist', error);
      return text(c, 'Error adding content to the playlist', 500);
    }
  });

  app.post('/playlist/removeContent/:playlistId', allowIfAnyOf('active'), async (c) => {
    try {
      const body = await readJsonBody(c);
      if (!body) return text(c, 'Invalid JSON', 400);
      const playlistId = c.req.param('playlistId');
      const contentId = typeof body.contentId === 'string' ? body.contentId : '';
      if (!playlistId || !contentId) return text(c, 'Invalid request body or parameters', 400);
      const user = extractUser(c);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const allowed = await playlistDb.isUserAssociatedToPlaylist(sql, schema, user.uuid, playlistId);
      if (!allowed) return text(c, 'User does not have permission to update playlist', 403);
      const updated = await playlistDb.removeContentFromPlaylist(sql, schema, playlistId, contentId);
      if (!updated) return text(c, 'Error removing content from the playlist', 500);
      return c.json(apiResultFromRow(updated));
    } catch (error) {
      console.error('Error removing content from the playlist', error);
      return text(c, 'Error removing content from the playlist', 500);
    }
  });

  app.post('/playlist/:playlistId', allowIfAnyOf('active'), async (c) => {
    try {
      const body = await readJsonBody(c);
      if (!body) return text(c, 'Invalid JSON', 400);
      const user = extractUser(c);
      const playlistId = c.req.param('playlistId');
      if (!user.uuid || Object.keys(body).length === 0 || !playlistId) return text(c, 'Invalid request body or parameters', 400);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const allowed = await playlistDb.isUserAssociatedToPlaylist(sql, schema, user.uuid, playlistId);
      if (!allowed) return text(c, 'User does not have permission to update playlist', 403);
      const updated = await playlistDb.updatePlaylist(sql, schema, playlistId, { ...body });
      return c.json(apiResultFromRow(updated));
    } catch (error) {
      console.error('Error updating the playlist', error);
      return text(c, 'Error updating the playlist', 500);
    }
  });

  app.delete('/playlist/:playlistId', allowIfAnyOf('active'), async (c) => {
    try {
      const playlistId = c.req.param('playlistId');
      if (!playlistId) return text(c, 'Invalid request parameters', 400);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const playlist = await playlistDb.getPlaylistById(sql, schema, playlistId);
      if (!playlist) return text(c, 'Playlist not found', 404);
      const user = extractUser(c);
      const allowed = await playlistDb.isUserAssociatedToPlaylist(sql, schema, user.uuid, playlistId);
      if (!allowed) return text(c, 'User does not have permission to delete this playlist', 403);
      const deleted = await playlistDb.deletePlaylist(sql, schema, playlistId);
      return c.json(deleted);
    } catch (error) {
      console.error('Error deleting playlist', error);
      return text(c, 'Could not delete playlist', 500);
    }
  });
}
