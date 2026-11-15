import mime from 'mime';
import type { Env } from '../env';
import type { Sql } from '../db/sql';
import * as filesDb from '../db/queries/files';
import * as stream from './stream';
import { deleteR2Object } from './r2';

export type PlayerInfo = {
  hlsUrl?: string;
  dashUrl?: string;
  videoIdOrSignedUrl?: string;
  mimeType?: string;
  fileType?: string;
  publicUrl?: string;
  filePathInBucket?: string;
};

export type FileDetails = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  storageType: string;
  playerInfo: PlayerInfo;
};

type VideoDetails = {
  readyToStream?: boolean;
  uid?: string;
  playback?: { hls?: string; dash?: string };
};

export async function getFile(sql: Sql, schema: string, env: Env, fileId: string): Promise<FileDetails | undefined> {
  const row = await filesDb.getFileById(sql, schema, fileId);
  if (!row) throw new Error(`File ${fileId} not found.`);

  const data = row.data ?? {};
  let playerInfo: PlayerInfo = {};

  if (row.storage_type === 'cloudflareStream') {
    const videoDetails = (await stream.getVideoDetails(env, String(data.cloudflareStreamUid ?? ''))) as VideoDetails | null;
    if (!videoDetails) throw new Error(`File ${fileId} not found.`);
    if (!videoDetails.readyToStream) return undefined;
    playerInfo = {
      hlsUrl: videoDetails.playback?.hls,
      dashUrl: videoDetails.playback?.dash,
      videoIdOrSignedUrl: videoDetails.uid
    };
  }

  if (row.storage_type === 'cloudflareR2') {
    const filePathInBucket = String(data.filePathInBucket ?? '');
    const mimeType = mime.getType(filePathInBucket) || 'application/octet-stream';
    const fileType = mime.getExtension(mimeType) || 'bin';
    playerInfo = {
      mimeType,
      fileType,
      publicUrl: `${env.CLOUDFLARE_R2_PUBLIC_BUCKET_BASE_URL}/${filePathInBucket}`,
      filePathInBucket
    };
  }

  return {
    id: fileId,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    storageType: row.storage_type,
    playerInfo
  };
}

export async function deleteCloudflareData(sql: Sql, schema: string, env: Env, fileId: string): Promise<string | void> {
  try {
    const file = await getFile(sql, schema, env, fileId);
    if (!file) return `File ${fileId} not found.`;

    if (file.storageType === 'cloudflareStream' && file.playerInfo.videoIdOrSignedUrl) {
      const videoDetails = await stream.getVideoDetails(env, file.playerInfo.videoIdOrSignedUrl);
      const uid = (videoDetails as VideoDetails | null)?.uid;
      if (uid) await stream.deleteVideo(env, uid);
    }

    if (file.storageType === 'cloudflareR2' && file.playerInfo.filePathInBucket) {
      await deleteR2Object(env, file.playerInfo.filePathInBucket);
    }
  } catch (error) {
    console.error('Error deleting file', error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
