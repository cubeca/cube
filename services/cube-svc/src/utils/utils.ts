import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as settings from '../settings';
import { body } from 'express-validator';
import { AxiosHeaders } from 'axios';
import { Request } from 'express';
import * as proo from '../db/queries/profile';
import * as cloudflare from '../db/queries/cloudflare';

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);
export const encryptString = (hash: string) => CryptoJS.AES.encrypt(hash, settings.ENCRYPT_SECRET).toString();
export const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const decryptString = (hash: string) => CryptoJS.AES.decrypt(hash, settings.ENCRYPT_SECRET).toString(CryptoJS.enc.Utf8);

export const brevoTemplateIdMapping = {
  SEND_VERIFICATION_EMAIL: 2,
  PASSWORD_CHANGE_CONFIRMATION: 3,
  PASSWORD_RESET_EMAIL: 4,
  REPORT_ABUSE_TEMPLATE: 12,
  CONTACT_US_EMAIL: 19
};

export const getApiResultFromDbRow = (r: any) => ({
  id: r.id,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  ...r.data
});

export const validateUserCreateInput = [
  body('name').notEmpty().trim().escape().withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('organization').optional().trim().escape(),
  body('website').optional().trim().escape(),
  body('tag').optional().trim().escape()
];

export const filterHeadersToForward = (req: Request, ...allowList: string[]): AxiosHeaders => {
  return new AxiosHeaders(filterObject(req.headers, ...allowList) as { [key: string]: string });
};

export const filterObject = (obj: any, ...allowedKeys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key, _]: [key: string, _: any]) => allowedKeys.includes(key)));

export const stringToKeyValuePairs = (str: any) => {
  if (str === '{}') {
    return {};
  }

  const pairs = str.split('&');
  const result: any = {};

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    result[key] = value;
  }

  return result;
};

import { Buffer } from 'node:buffer';

export const base64encode = (s: any) => Buffer.from(String(s), 'utf8').toString('base64');
export const base64decode = (b64: any): string | Buffer | undefined => {
  let decoded = undefined;
  try {
    decoded = Buffer.from(String(b64), 'base64');
  } catch (err: any) {
    return undefined;
  }
  try {
    return decoded.toString('utf8');
  } catch (err: any) {
    return decoded;
  }
};

export interface UploadMetadata {
  reserveDurationSeconds?: number;
  isPrivate?: boolean;
  urlValidDurationSeconds?: number;
  uploadingUserId?: string;
}

export const makeCloudflareTusUploadMetadata = ({ reserveDurationSeconds, isPrivate, urlValidDurationSeconds, uploadingUserId }: UploadMetadata = {}) => {
  const fields: {
    maxDurationSeconds?: number;
    requiresignedurls?: boolean;
    expiry?: string;
    creator?: string;
  } = {};

  if (reserveDurationSeconds) {
    fields.maxDurationSeconds = reserveDurationSeconds;
  }

  if (isPrivate) {
    fields.requiresignedurls = true;
  }

  if (urlValidDurationSeconds) {
    const expiry = new Date(Date.now() + urlValidDurationSeconds * 1000);
    fields.expiry = expiry.toISOString();
  }

  if (uploadingUserId) {
    fields.creator = `user:${uploadingUserId}`;
  }

  const serialized: string[] = [];
  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    const fieldString = true === fieldValue ? fieldName : `${fieldName} ${base64encode(fieldValue)}`;
    serialized.push(fieldString);
  }

  return serialized.join(',');
  // maxDurationSeconds NjAw,requiresignedurls,expiry MjAyMy0wMi0yMFQwMDowMDowMFoK,creator ZnJvbS1tZXRhZGF0YS1yYXBoYWVsCg==
};

export const parseTusUploadMetadata = (headerValues: string | string[]): any => {
  const parsed: { [k: string]: string | true | Buffer | undefined } = {};
  for (const headerValue of Array.isArray(headerValues) ? headerValues : [headerValues]) {
    for (const [metaName, metaValue] of headerValue.split(',').map((m: string) => m.split(' '))) {
      parsed[metaName] = !metaValue ? true : base64decode(metaValue);
    }
  }
  return parsed;
};

export const inspect = (...things: any) => things.forEach((thing: any) => console.dir(thing, { depth: null, color: true }));

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
  const r = await profileQueries.selectProfileByID(profileId);
  const profileData = r?.dataValues;

  const { files } = await getFiles([profile.herofileid, profile.logofileid, profile.descriptionfileid], authHeader);

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
          const getCollaboratorInfoResponse = await profileApi.post('getProfilesByIdList', { profileIdList: [collaboratorId] }, { headers: authHeader });

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

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${settings.CLOUDFLARE_SERVICE_URL}/upload/video-tus-reservation`;

export const getUploadTusEndpoint = (fileId: string, authToken: string): string => {
  const url = new URL(UPLOAD_TUS_ENDPOINT);
  url.searchParams.set('fileId', fileId);
  url.searchParams.set('authorization', authToken);
  return url.toString();
};
