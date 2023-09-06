import { upload } from './upload';
import { contentApi } from '.';

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

export const addContent = async ({
  payload,
  coverImageFile,
  mediaFile,
  subtitlesFile,
  transcriptFile
}: {
  payload: any;
  coverImageFile?: File;
  mediaFile?: File;
  subtitlesFile?: File;
  transcriptFile?: File;
}) => {
  if (coverImageFile) {
    const fileId = await upload(coverImageFile, payload.profileId);
    if (fileId) {
      payload.coverImageFileId = fileId;
    }
  }

  if (mediaFile) {
    const fileId = await upload(mediaFile, payload.profileId);
    if (fileId) {
      payload.mediaFileId = fileId;
    }
  }

  if (subtitlesFile) {
    const fileId = await upload(subtitlesFile, payload.profileId);
    if (fileId) {
      payload.subtitlesFileId = fileId;
    }
  }

  if (transcriptFile) {
    const fileId = await upload(transcriptFile, payload.profileId);
    if (fileId) {
      payload.transcriptFileId = fileId;
    }
  }

  return await contentApi.addContent(payload);
};
