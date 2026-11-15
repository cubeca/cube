import type { Hono } from 'hono';
import type { AppEnv } from '../app-env';
import { allowIfAnyOf, extractUser } from '../middleware/auth';
import * as contentDb from '../db/queries/content';
import * as profileDb from '../db/queries/profile';
import { deleteCloudflareData } from '../services/files';
import { getProfileData } from '../services/transform';
import { readJsonBody, text } from '../utils/http';

function schemaOf(env: { DB_SCHEMA?: string }): string {
  return env.DB_SCHEMA || 'cube';
}

export function registerProfile(app: Hono<AppEnv>): void {
  app.get('/profiles', allowIfAnyOf('anonymous', 'active'), async (c) => {
    try {
      const rows = await profileDb.selectAllProfiles(c.get('sql'), schemaOf(c.env));
      return c.json(rows);
    } catch (error) {
      console.error('Error return all profiles', error);
      return text(c, 'Error return all profiles', 404);
    }
  });

  app.get('/collaborators', allowIfAnyOf('anonymous', 'active'), async (c) => {
    try {
      const rows = await profileDb.selectAllProfiles(c.get('sql'), schemaOf(c.env));
      return c.json(rows.map((item) => ({ id: item.id, organization: item.organization, tag: item.tag })));
    } catch (error) {
      console.error('Error return all profiles', error);
      return text(c, 'Error return all profiles', 404);
    }
  });

  app.post('/profiles', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const organization = typeof body.organization === 'string' ? body.organization : '';
    const website = typeof body.website === 'string' ? body.website : '';
    const tag = typeof body.tag === 'string' ? body.tag : '';
    if (!organization || !website || !tag) {
      return text(c, 'Invalid Request Body: organization, website, and tag must be provided.', 401);
    }
    try {
      const created = await profileDb.insertProfile(c.get('sql'), schemaOf(c.env), organization, website, tag);
      return c.json({ id: created.id }, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('duplicate key')) {
        console.error('Organization with provided details already exists', error);
        return text(c, 'Organization with provided details already exists', 400);
      }
      console.error('Error creating profile', error);
      return text(c, 'Error creating profile', 500);
    }
  });

  app.patch('/profiles/:profileId', allowIfAnyOf('active'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    if (!(body.organization || body.website || body.heroFileId || body.logoFileId || body.description || body.descriptionFileId || body.budget || body.status)) {
      return c.json('You must supply at least one field to update!', 500);
    }
    const profileId = c.req.param('profileId');
    const user = extractUser(c);
    const sql = c.get('sql');
    const schema = schemaOf(c.env);
    const allowed = await profileDb.isUserAssociatedToProfile(sql, schema, user.uuid, profileId);
    if (!allowed) return text(c, 'User does not have permission to update this profile', 403);
    try {
      const updated = await profileDb.updateProfile(
        sql,
        schema,
        profileId,
        body.organization as string | undefined,
        body.website as string | undefined,
        body.heroFileId as string | undefined,
        body.logoFileId as string | undefined,
        body.description as string | undefined,
        body.descriptionFileId as string | undefined,
        body.budget as string | undefined,
        body.status as string | undefined
      );
      if (!updated) return c.body(null, 200);
      return c.json(updated);
    } catch (error) {
      console.error('Error updating profile', error);
      return c.json({}, 500);
    }
  });

  app.get('/profiles/tag/:tag', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const tag = c.req.param('tag');
    if (!tag) return text(c, 'Profile tag is not provided.', 404);
    try {
      const row = await profileDb.selectProfileByTag(c.get('sql'), schemaOf(c.env), tag);
      if (!row) return text(c, 'Profile tag not found', 404);
      const profile = await getProfileData(c.get('sql'), schemaOf(c.env), c.env, row.id);
      return c.json({ data: profile });
    } catch (error) {
      console.error('Profile does not exists', error);
      return text(c, 'Profile does not exist', 404);
    }
  });

  app.get('/profiles/:profileId', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const profileId = c.req.param('profileId');
    if (!profileId) return text(c, 'Profile Id not provided.', 404);
    try {
      const profile = await getProfileData(c.get('sql'), schemaOf(c.env), c.env, profileId);
      return c.json({ ...profile });
    } catch (error) {
      console.error('Profile does not exist', error);
      return text(c, 'Profile does not exist', 404);
    }
  });

  app.post('/getProfilesByIdList', allowIfAnyOf('anonymous', 'active'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const profileIdList = body.profileIdList;
    if (!profileIdList || !Array.isArray(profileIdList)) return text(c, 'Profile id list not provided.', 404);
    try {
      const rows = await profileDb.selectProfilesByIdList(c.get('sql'), schemaOf(c.env), profileIdList.map(String));
      return c.json(rows);
    } catch (error) {
      console.error('Error retrieving profile list', error);
      return text(c, 'Error retrieving profile list', 404);
    }
  });

  app.post('/deactivateProfile', allowIfAnyOf('active'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const profileId = typeof body.profileId === 'string' ? body.profileId : '';
    if (!profileId) return text(c, 'Profile ID not provided', 400);
    const sql = c.get('sql');
    const schema = schemaOf(c.env);
    const user = extractUser(c);
    const profile = await profileDb.selectProfileByID(sql, schema, profileId);
    if (!profile) return text(c, 'Profile not found', 404);
    const allowed = await profileDb.isUserAssociatedToProfile(sql, schema, user.uuid, profileId);
    if (!allowed) return text(c, 'User does not have permission to deactivate this profile', 403);
    try {
      await profileDb.updateProfile(
        sql,
        schema,
        profileId,
        profile.organization,
        profile.website,
        profile.herofileid,
        profile.logofileid,
        profile.description,
        profile.descriptionfileid,
        profile.budget,
        'inactive'
      );
      const profileContent = await contentDb.listContentByProfileId(sql, schema, 0, 1000, {}, profileId);
      for (const contentItem of profileContent) {
        await contentDb.deleteContent(sql, schema, contentItem.id);
        const data = contentItem.data ?? {};
        if (data.mediaFileId) await deleteCloudflareData(sql, schema, c.env, String(data.mediaFileId));
        if (data.coverImageFileId) await deleteCloudflareData(sql, schema, c.env, String(data.coverImageFileId));
      }
      return text(c, 'Profile deactivated');
    } catch (error) {
      return text(c, error instanceof Error ? error.message : 'Error', 500);
    }
  });
}
