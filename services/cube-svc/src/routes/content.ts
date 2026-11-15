import type { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { allowIfAnyOf, extractUser } from '../middleware/auth';
import * as contentDb from '../db/queries/content';
import * as filesDb from '../db/queries/files';
import { sendReportAbuseEmail } from '../services/email';
import { deleteCloudflareData } from '../services/files';
import { apiResultFromRow, transformContent } from '../services/transform';
import { readJsonBody, text } from '../utils/http';
import { nestedRecord, parseRequestQuery, queryInt, queryString } from '../utils/query';

function schemaOf(env: { DB_SCHEMA?: string }): string {
  return env.DB_SCHEMA || 'cube';
}

export function registerContent(app: Hono<AppEnv>): void {
  app.post('/content', allowIfAnyOf('contentEditor'), async (c) => {
    try {
      const body = await readJsonBody(c);
      if (!body) return text(c, 'Invalid JSON', 400);
      const profileId = typeof body.profileId === 'string' ? body.profileId : '';
      const contentData: Record<string, unknown> = { ...body };
      delete contentData.profileId;
      const vttFileId = contentData.vttFileId;
      delete contentData.vttFileId;
      if (!profileId || Object.keys(contentData).length === 0) return text(c, 'Invalid request body', 400);

      const user = extractUser(c);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const allowed = await contentDb.isUserAssociatedToProfile(sql, schema, user.uuid, profileId);
      if (!allowed) return text(c, 'User does not have permission to create content for this profile', 403);
      if (vttFileId) contentData.vttFileId = vttFileId;

      const created = await contentDb.insertContent(sql, schema, { profileId, ...contentData });
      return c.json(apiResultFromRow(created), 201);
    } catch (error) {
      console.error('Error creating the content item', error);
      return text(c, 'Error creating the content item', 500);
    }
  });

  app.get('/content', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const query = parseRequestQuery(c.req.url);
    const offset = queryInt(query.offset, 0);
    const limit = queryInt(query.limit, 10);
    const profileId = queryString(query.profileId);
    const filters = nestedRecord(query.filters);
    const rows = await contentDb.listContentByProfileId(c.get('sql'), schemaOf(c.env), offset, limit, filters, profileId || undefined);
    const transformed = await transformContent(
      c.get('sql'),
      schemaOf(c.env),
      c.env,
      rows.map((row) => apiResultFromRow(row))
    );
    return c.json(transformed);
  });

  app.get('/content/:contentId', async (c) => {
    const contentId = c.req.param('contentId');
    if (!contentId) return text(c, 'Invalid content ID', 400);
    const row = await contentDb.getContentById(c.get('sql'), schemaOf(c.env), contentId);
    if (!row) return text(c, 'Content not found', 404);
    const transformed = await transformContent(c.get('sql'), schemaOf(c.env), c.env, [apiResultFromRow(row)]);
    return c.json(transformed[0] ?? null);
  });

  app.post('/content/:contentId', allowIfAnyOf('contentEditor'), async (c) => {
    try {
      const body = await readJsonBody(c);
      if (!body) return text(c, 'Invalid JSON', 400);
      const profileId = typeof body.profileId === 'string' ? body.profileId : '';
      const contentData: Record<string, unknown> = { ...body };
      delete contentData.profileId;
      const contentId = c.req.param('contentId');
      if (!profileId || Object.keys(contentData).length === 0 || !contentId) {
        return text(c, 'Invalid request body or parameters', 400);
      }
      const user = extractUser(c);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const allowed = await contentDb.isUserAssociatedToProfile(sql, schema, user.uuid, profileId);
      if (!allowed) return text(c, 'User does not have permission to update content for this profile', 403);
      const updated = await contentDb.updateContent(sql, schema, { profileId, ...contentData }, contentId);
      return c.json(apiResultFromRow(updated));
    } catch (error) {
      console.error('Error updating the content item', error);
      return text(c, 'Error updating the content item', 500);
    }
  });

  app.delete('/content/:contentId', allowIfAnyOf('contentEditor'), async (c) => {
    try {
      const contentId = c.req.param('contentId');
      if (!contentId) return text(c, 'Invalid request parameters', 400);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const contentItem = await contentDb.getContentById(sql, schema, contentId);
      if (!contentItem) return text(c, 'Content not found', 404);
      const user = extractUser(c);
      const profileId = String(contentItem.data?.profileId ?? '');
      const allowed = await contentDb.isUserAssociatedToProfile(sql, schema, user.uuid, profileId);
      if (!allowed) return text(c, 'User does not have permission to delete content for this profile', 403);
      const deleted = await contentDb.deleteContent(sql, schema, contentId);
      const data = contentItem.data ?? {};
      if (data.mediaFileId) await deleteCloudflareData(sql, schema, c.env, String(data.mediaFileId));
      if (data.coverImageFileId) await deleteCloudflareData(sql, schema, c.env, String(data.coverImageFileId));
      if (data.mediaFileId) await filesDb.deleteFileById(sql, schema, String(data.mediaFileId));
      return c.json(apiResultFromRow(deleted));
    } catch (error) {
      console.error('Error deleting content item', error);
      return text(c, 'Could not delete content item', 500);
    }
  });

  app.post('/report', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const disputedUrl = String(body.disputedUrl ?? '');
    const requestType = String(body.requestType ?? '');
    const contactName = String(body.contactName ?? '');
    const contactEmail = String(body.contactEmail ?? '');
    const issueDesc = String(body.issueDesc ?? '');
    const ticketId = String(body.ticketId ?? '');
    if (!disputedUrl || !requestType || !contactName || !contactEmail || !issueDesc || !ticketId) {
      return text(c, 'Missing required parameters', 400);
    }
    try {
      await sendReportAbuseEmail(c.env, disputedUrl, requestType, contactName, contactEmail, issueDesc, ticketId);
      return c.json('OK');
    } catch (error) {
      console.error('Error sending content report', error);
      return text(c, 'Error sending content report', 500);
    }
  });
}
