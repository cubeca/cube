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

export async function transformContent(contentItems: any[], authHeader: AxiosHeaders) {
  const urlFieldNames = {
    coverImageFileId: 'coverImageUrl',
    mediaFileId: 'mediaUrl',
    vttFileId: 'vttFileUrl',
    bannerImageFileId: 'bannerImageUrl'
  };

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

      if (item.collaborators !== null && item.collaborators.length > 0) {
        const collaboratorInfo = await fetchCollaboratorInfo(item.collaborators);
        newItem.collaboratorDetails = collaboratorInfo;
        delete newItem.collaborators;
      }

      return newItem;
    })
  );

  // Separated the logic to get the file from cloudflare API for reusability
  async function getFileFromCloudflare(fileId: string) {
    const response = await cloudflareApi.get(`files/${fileId}`, { headers: authHeader });
    return response.data;
  }

  async function fetchCollaboratorInfo(collaborators: string[]) {
    const collaboratorInfoList = [];

    for (let i = 0; i < collaborators.length; i++) {
      const collaboratorId = collaborators[i];
      if (collaboratorId !== '' && collaboratorId !== null) {
        try {
          const getCollaboratorInfoResponse = await profileApi.post(
            'getProfilesByIdList',
            { profileIdList: [collaboratorId] },
            { headers: authHeader }
          );

          const { organization, logofileid, tag } = getCollaboratorInfoResponse.data[0];

          let logoUrl = null;
          if (logofileid) {
            try {
              const fileResponse = await getFileFromCloudflare(logofileid);
              logoUrl = fileResponse.playerInfo?.publicUrl;
            } catch (fileError) {
              console.error(`Failed to fetch file from Cloudflare for collaborator ${collaboratorId}:`, fileError);
            }
          }

          collaboratorInfoList.push({ organization, logoUrl, tag });
        } catch (error) {
          console.error(`Failed to fetch info for collaborator ${collaboratorId}:`, error);
        }
      }
    }

    return collaboratorInfoList;
  }
}
