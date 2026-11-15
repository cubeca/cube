import type { Env } from '../env';
import type { Sql } from '../db/sql';
import type { JsonRow } from '../db/types';
import * as contentDb from '../db/queries/content';
import * as profileDb from '../db/queries/profile';
import { getFile, type FileDetails, type PlayerInfo } from './files';

export function apiResultFromRow(row: JsonRow | null | undefined): Record<string, unknown> {
  if (!row) throw new Error('Missing database row');
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.data ?? {})
  };
}

async function fileOrUndefined(sql: Sql, schema: string, env: Env, fileId: string): Promise<FileDetails | undefined> {
  return getFile(sql, schema, env, fileId);
}

export async function getProfileData(sql: Sql, schema: string, env: Env, profileId: string): Promise<Record<string, unknown>> {
  const row = await profileDb.selectProfileByID(sql, schema, profileId);
  const profileResult: Record<string, unknown> = row ? { ...row } : {};

  const { files } = await getFiles(sql, schema, env, [
    profileResult.herofileid as string,
    profileResult.logofileid as string,
    profileResult.descriptionfileid as string
  ]);

  const hero = files[String(profileResult.herofileid ?? '')];
  const logo = files[String(profileResult.logofileid ?? '')];
  const description = files[String(profileResult.descriptionfileid ?? '')];
  if (hero) profileResult.heroUrl = (hero.playerInfo as PlayerInfo).publicUrl;
  if (logo) profileResult.logoUrl = (logo.playerInfo as PlayerInfo).publicUrl;
  if (description) profileResult.descriptionUrl = (description.playerInfo as PlayerInfo).publicUrl;
  return { ...profileResult };
}

export async function getFiles(sql: Sql, schema: string, env: Env, fileIds: Array<string | undefined | null>): Promise<{ files: Record<string, FileDetails>; errors: unknown[] }> {
  const files: Record<string, FileDetails> = {};
  const errors: unknown[] = [];
  const filtered = fileIds.filter((fileId): fileId is string => !!fileId);
  try {
    const results = await Promise.all(filtered.map((fileId) => getFile(sql, schema, env, fileId)));
    for (const result of results) {
      if (result) files[result.id] = result;
    }
  } catch (error) {
    errors.push({ error });
  }
  return { files, errors };
}

const playlistUrlFields: Record<string, string> = { coverImageFileId: 'coverImageUrl' };

export async function transformPlaylist(sql: Sql, schema: string, env: Env, playlistItems: JsonRow[]): Promise<Record<string, unknown>[]> {
  return Promise.all(
    playlistItems.map(async (item) => {
      const data = { ...(item.data ?? {}) };
      const contentIds = Array.isArray(data.contentIds) ? (data.contentIds as string[]) : undefined;
      const newItem: Record<string, unknown> = { ...item, data };

      for (const [key, value] of Object.entries(playlistUrlFields)) {
        if (data[key]) {
          data[value] = await fileOrUndefined(sql, schema, env, String(data[key]));
          delete data[key];
        }
      }

      if (contentIds && contentIds.length > 0) {
        const contentData = await Promise.all(
          contentIds.map(async (contentId) => {
            const contentItem = await contentDb.getContentById(sql, schema, contentId);
            return contentItem ?? undefined;
          })
        );
        const contentItems = contentData.filter((entry): entry is JsonRow => !!entry).map((entry) => apiResultFromRow(entry));
        newItem.contentItems = await transformContentSimple(sql, schema, env, contentItems);
      }

      return newItem;
    })
  );
}

export async function transformContentSimple(sql: Sql, schema: string, env: Env, contentItems: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
  return Promise.all(
    contentItems.map(async (item) => {
      const newItem = { ...item };
      if (item.coverImageFileId) {
        newItem.coverImageUrl = await fileOrUndefined(sql, schema, env, String(item.coverImageFileId));
        delete newItem.coverImageFileId;
      }
      return newItem;
    })
  );
}

export async function transformPlaylistSimple(sql: Sql, schema: string, env: Env, playlistItems: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
  return Promise.all(
    playlistItems.map(async (item) => {
      const newItem = { ...item };
      if (item.coverImageFileId) {
        newItem.coverImageUrl = await fileOrUndefined(sql, schema, env, String(item.coverImageFileId));
        delete newItem.coverImageFileId;
      }
      return newItem;
    })
  );
}

const contentUrlFields: Record<string, string> = {
  coverImageFileId: 'coverImageUrl',
  mediaFileId: 'mediaUrl',
  vttFileId: 'vttFileUrl',
  bannerImageFileId: 'bannerImageUrl'
};

export async function transformContent(sql: Sql, schema: string, env: Env, contentItems: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
  return Promise.all(
    contentItems.map(async (item) => {
      const newItem = { ...item };
      for (const [key, value] of Object.entries(contentUrlFields)) {
        if (item[key]) {
          newItem[value] = await fileOrUndefined(sql, schema, env, String(item[key]));
          delete newItem[key];
        }
      }

      if (Array.isArray(item.collaborators) && item.collaborators.length > 0) {
        newItem.collaboratorDetails = await fetchCollaboratorInfo(sql, schema, env, item.collaborators.map(String));
        delete newItem.collaborators;
      }
      return newItem;
    })
  );
}

async function fetchCollaboratorInfo(sql: Sql, schema: string, env: Env, collaborators: string[]): Promise<Record<string, unknown>[]> {
  const collaboratorInfoList: Record<string, unknown>[] = [];
  for (const collaboratorId of collaborators) {
    if (!collaboratorId) continue;
    try {
      const profileData = await profileDb.selectProfileByID(sql, schema, collaboratorId);
      if (!profileData) continue;
      let logoUrl: string | undefined;
      if (profileData.logofileid) {
        try {
          const fileResponse = await getFile(sql, schema, env, profileData.logofileid);
          logoUrl = fileResponse?.playerInfo.publicUrl;
        } catch (fileError) {
          console.error(`Failed to fetch file from Cloudflare for collaborator ${collaboratorId}:`, fileError);
        }
      }
      collaboratorInfoList.push({ organization: profileData.organization, logoUrl: logoUrl ?? null, tag: profileData.tag });
    } catch (error) {
      console.error(`Failed to fetch info for collaborator ${collaboratorId}:`, error);
    }
  }
  return collaboratorInfoList;
}
