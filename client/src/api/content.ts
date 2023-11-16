import { upload } from './upload';
import { contentApi } from '.';
import { AddContentRequest } from '@cubeca/bff-client-oas-axios';

export type CategoryType =
  | 'all'
  | 'video'
  | 'audio'
  | 'vr'
  | 'pdf'
  | 'digital-publications'
  | 'talks'
  | 'performances'
  | 'link'
  | 'cultural-teachings';

export type ContentType = 'video' | 'audio' | 'pdf' | 'link';

export type NationType = 'CA';

export const getContent = async (
  category?: CategoryType,
  type?: ContentType,
  nation?: NationType,
  creator?: string
) => {
  //return await contentApi.contentList(1, 10, category, type, nation, creator);
};

export const getContentDetails = async (id: string) => {
  return await contentApi.getContent(id);
};

export const getContentByProfileId = async (profileId: string) => {
  return await contentApi.getContentByProfileid(0, 10, profileId);
};

export const addContent = async ({
  payload,
  coverImageFile,
  bannerImageFile,
  mediaFile,
  vttFile,
  transcriptFile
}: {
  payload: AddContentRequest;
  coverImageFile?: File;
  bannerImageFile?: File;
  mediaFile?: File;
  vttFile?: File;
  transcriptFile?: File;
}) => {
  if (coverImageFile) {
    const fileId = await upload(coverImageFile, payload.profileId);
    if (fileId) {
      payload.coverImageFileId = fileId;
    }
  }
  if (bannerImageFile) {
    const fileId = await upload(bannerImageFile, payload.profileId);
    if (fileId) {
      payload.bannerImageFileId = fileId;
    }
  }

  if (mediaFile) {
    const fileId = await upload(mediaFile, payload.profileId);
    if (fileId) {
      payload.mediaFileId = fileId;
    }
  }

  if (vttFile) {
    const fileId = await upload(vttFile, payload.profileId);
    if (fileId) {
      payload.vttFileId = fileId;
    }
  }

  // if (transcriptFile) {
  //   const fileId = await upload(transcriptFile, payload.profileId);
  //   if (fileId) {
  //     payload.transcriptFileId = fileId;
  //   }
  // }

  return await contentApi.addContent(payload);
};
