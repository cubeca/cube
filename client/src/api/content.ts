import { blobToBase64, upload } from './helpers';
import { AddContent, contentApi, contentFilesApi } from './httpClient';

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

export type { AddContent } from './httpClient';

export const getContent = async (
  category?: CategoryType,
  type?: ContentType,
  nation?: NationType,
  creator?: string
) => {
  const listApi = await contentApi.contentList(
    1,
    10,
    category,
    type,
    nation,
    creator
  );
  return await listApi();
};

export const getContentDetails = async (id: string) => {
  const detailsApi = await contentApi.contentDetails(id);
  return await detailsApi();
};

export const addContent = async ({
  payload,
  coverImageFile,
  mediaFile
}: {
  payload: Omit<AddContent, 'coverImageFile' | 'mediaFile'>;
  coverImageFile?: File;
  mediaFile?: File;
}) => {
  const coverImagePayload = coverImageFile
    ? {
        name: coverImageFile.name,
        file_contents_base64: (await blobToBase64(coverImageFile)) as string
      }
    : {
        name: '',
        file_contents_base64: ''
      };
  const mediaFilePayload = mediaFile
    ? {
        name: mediaFile.name,
        file_contents_base64: (await blobToBase64(mediaFile)) as string
      }
    : {
        name: '',
        file_contents_base64: ''
      };

  // TODO upload non-video files // if (coverImageFile) upload(coverImageFile);
  if (mediaFile) upload(mediaFile);

  const addContentApi = await contentFilesApi.addContent({
    ...payload,
    coverImageFile: coverImagePayload,
    mediaFile: mediaFilePayload
  });
  return await addContentApi();
};
