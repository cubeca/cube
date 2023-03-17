import { upload } from './upload';
import { AddContent, contentApi, contentFilesApi } from '.';

export type CategoryType =
  | 'all'
  | 'video'
  | 'audio'
  | 'vr'
  | 'pdf'
  | 'digital-publications'
  | 'talks'
  | 'performances'
  | 'cultural-teachings';

export type ContentType = 'video' | 'audio' | 'pdf';

export type NationType = 'CA';

export type { AddContent } from '.';

export const getContent = async (
  category?: CategoryType,
  type?: ContentType,
  nation?: NationType,
  creator?: string
) => {
  return await contentApi.contentList(1, 10, category, type, nation, creator);
};

export const getContentDetails = async (id: string) => {
  return await contentApi.contentDetails(id);
};

export const addContent = async ({
  payload,
  coverImageFile,
  mediaFile
}: {
  payload: Omit<AddContent, 'coverImageFileId' | 'mediaFileId'>;
  coverImageFile?: File;
  mediaFile?: File;
}) => {
  let coverImageFileId: string | undefined = undefined;
  let mediaFileId: string | undefined = undefined;
  // TODO upload non-video files // if (coverImageFile) upload(coverImageFile);

  if (coverImageFile) {
    coverImageFileId = await upload(coverImageFile, payload.profileId);
  }

  if (mediaFile) {
    mediaFileId = await upload(mediaFile, payload.profileId);
  }

  return await contentFilesApi.addContent({
    ...payload,
    coverImageFileId: String(coverImageFileId),
    mediaFileId: String(mediaFileId)
  });
};
