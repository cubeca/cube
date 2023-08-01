import { cloudflareApi } from './microservices';

export const inspect = (...things: any) =>
  things.forEach((thing: any) => console.dir(thing, { depth: null, color: true }));

export const filterObject = (obj: any, ...allowedKeys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key, _]: [key: string, _: any]) => allowedKeys.includes(key)));

export const getFiles = async (fileIds: string[]) => {
  const files: { [k: string]: any } = {};
  const errors: any[] = [];

  // Filter out empty or falsy values from fileIds array
  const filteredFileIds = fileIds.filter((fileId) => !!fileId);

  // Perform API requests concurrently using Promise.all
  const apiRequests = filteredFileIds.map((fileId) =>
    cloudflareApi
      .get(`files/${fileId}`)
      .then(({ status, data }) => {
        if (status === 200) {
          files[fileId] = data;
        } else {
          errors.push({ fileId, status, data });
        }
      })
      .catch((error) => {
        errors.push({ fileId, error });
      })
  );

  // Wait for all the API requests to finish
  await Promise.all(apiRequests);
  return { files, errors };
};

export async function transformContentForProfile(contentItems: any[]) {
  const fieldNames = {
    coverImageFileId: 'coverImageUrl',
    mediaFileId: 'mediaUrl',
    subtitlesFileId: 'subtitlesUrl',
    transcriptFileId: 'transcriptUrl'
  };

  return Promise.all(
    contentItems.map(async (item) => {
      const newItem = { ...item };
      for (const [key, value] of Object.entries(fieldNames)) {
        if (item[key]) {
          const getFileResponse = await cloudflareApi.get(`files/${item[key]}`);
          newItem[value] = getFileResponse.data;
          delete newItem[key];
        }
      }
      return newItem;
    })
  );
}
