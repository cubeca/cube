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

  profile.content = await transformContent(contentResponse.data.data, authHeader);
  return profile;
};

interface Collaborator {
  logofileid?: string;
  logoUrl?: string;
  website?: string;
  herofileid?: string;
  descriptionfileid?: string;
  description?: string;
  budget?: string;
}

export async function transformContent(contentItems: any[], authHeader: AxiosHeaders) {
  const urlFieldNames = {
    coverImageFileId: 'coverImageUrl',
    mediaFileId: 'mediaUrl',
    subtitlesFileId: 'subtitlesUrl',
    transcriptFileId: 'transcriptUrl'
  };

  const collaboratorFieldName = {
    collaborators: 'collaboratorDetails'
  };

  // Separated the logic to get the file from cloudflare API for reusability
  async function getFileFromCloudflare(fileId: string) {
    const response = await cloudflareApi.get(`files/${fileId}`, { headers: authHeader });
    return response.data;
  }

  return Promise.all(
    contentItems.map(async (item) => {
      const newItem = { ...item };

      // Process URL fields
      for (const [key, value] of Object.entries(urlFieldNames)) {
        if (item[key]) {
          newItem[value] = await getFileFromCloudflare(item[key]);
          delete newItem[key];
        }
      }

      // Process collaborator fields
      for (const [key, value] of Object.entries(collaboratorFieldName)) {
        if (item[key]) {
          const getCollaboratorInfoResponse = await profileApi.post(
            'getProfilesByIdList',
            { profileIdList: item[key] },
            { headers: authHeader }
          );
          const collaborators: Collaborator[] = Object.values(getCollaboratorInfoResponse.data);

          const updatedCollaborators = await Promise.all(
            collaborators.map(async (collaborator) => {
              if (collaborator.logofileid) {
                const data = await getFileFromCloudflare(collaborator.logofileid);
                return {
                  ...collaborator,
                  logoUrl: data.playerInfo.publicUrl
                };
              }
              return collaborator;
            })
          );

          newItem[value] = updatedCollaborators.filter((collaborator) => collaborator.logoUrl);
          delete newItem[key];
        }
      }

      return newItem;
    })
  );
}
