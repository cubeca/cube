import { AxiosHeaders } from 'axios';
import { cloudflareApi, profileApi, contentApi } from './microservices';

export const inspect = (...things: any) =>
  things.forEach((thing: any) => console.dir(thing, { depth: null, color: true }));

export const filterObject = (obj: any, ...allowedKeys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key, _]: [key: string, _: any]) => allowedKeys.includes(key)));

export const getFiles = async (fileIds: string[], authHeader: AxiosHeaders) => {
  const files: { [k: string]: any } = {};
  const errors: any[] = [];

  // Filter out empty or falsy values from fileIds array
  const filteredFileIds = fileIds.filter((fileId) => !!fileId);

  // Perform API requests concurrently using Promise.all
  const apiRequests = filteredFileIds.map((fileId) =>
    cloudflareApi
      .get(`files/${fileId}`, { headers: authHeader })
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

export const getProfileData = async (profileId: string, authHeader: AxiosHeaders) => {
  const profileResponse = await profileApi.get('profiles/' + profileId, {
    headers: authHeader
  });

  const { files } = await getFiles(
    [profileResponse.data.herofileid, profileResponse.data.logofileid, profileResponse.data.descriptionfileid],
    authHeader
  );

  const profile = profileResponse.data;
  if (files[profile.herofileid]) {
    profile.heroUrl = files[profile.herofileid].playerInfo.publicUrl;
  }
  if (files[profile.logofileid]) {
    profile.logoUrl = files[profile.logofileid].playerInfo.publicUrl;
  }
  if (files[profile.descriptionfileid]) {
    profile.descriptionUrl = files[profile.descriptionfileid].playerInfo.publicUrl;
  }

  const contentResponse = await contentApi.get('/content', {
    params: {
      profileId,
      offset: 0,
      limit: 1000
    },
    headers: authHeader
  });

  profile.content = await transformContentForProfile(contentResponse.data.data);
  return profile;
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
