import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as settings from '../settings';
import { body } from 'express-validator';
import { Buffer } from 'node:buffer';
import * as profile from '../db/queries/profile';
import * as content from '../db/queries/content';
import { getFile } from '../cloudflare';
import { NonVideoPlayerInfo, UploadMetadata } from '../types/cloudflare';

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);
export const encryptString = (hash: string) => CryptoJS.AES.encrypt(hash, settings.ENCRYPT_SECRET).toString();
export const decryptString = (hash: string) => CryptoJS.AES.decrypt(hash, settings.ENCRYPT_SECRET).toString(CryptoJS.enc.Utf8);
export const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
};

export const parseTusUploadMetadata = (headerValues: string | string[]): any => {
  const parsed: { [k: string]: string | true | Buffer | undefined } = {};
  for (const headerValue of Array.isArray(headerValues) ? headerValues : [headerValues]) {
    for (const [metaName, metaValue] of headerValue.split(',').map((m: string) => m.split(' '))) {
      if (metaName) {
        parsed[metaName] = !metaValue ? true : base64decode(metaValue);
      }
    }
  }
  return parsed;
};

export const getFiles = async (fileIds: string[]) => {
  const files: { [k: string]: any } = {};
  const errors: any[] = [];

  // Filter out empty or falsy values from fileIds array
  const filteredFileIds = fileIds.filter((fileId) => !!fileId);
  const promises = filteredFileIds.map((fileId) => getFile(fileId));

  await Promise.all(promises)
    .then((results) => {
      results.forEach((result) => {
        if (result) {
          files[result.id] = result;
        }
      });
    })
    .catch((error) => {
      errors.push({ error });
    });

  return { files, errors };
};

export const getProfileData = async (profileId: string) => {
  const r = await profile.selectProfileByID(profileId);
  const profileResult: { [k: string]: any } = { ...r?.dataValues };

  if (profileResult !== null) {
    const { files } = await getFiles([profileResult.herofileid, profileResult.logofileid, profileResult.descriptionfileid]);

    if (files[profileResult.herofileid]) {
      profileResult.heroUrl = files[profileResult.herofileid].playerInfo.publicUrl;
    }
    if (files[profileResult.logofileid]) {
      profileResult.logoUrl = files[profileResult.logofileid].playerInfo.publicUrl;
    }
    if (files[profileResult.descriptionfileid]) {
      profileResult.descriptionUrl = files[profileResult.descriptionfileid].playerInfo.publicUrl;
    }
  }

  const contentResult = await content.listContentByProfileId(0, 1000, {}, profileId);
  const contentData = contentResult.map(getApiResultFromDbRow);
  const transformedContent = await transformContent(contentData);

  return {
    ...profileResult,
    content: transformedContent
  };
};

export async function transformPlaylist(playlistItems: any[]) {
  const urlFieldNames = {
    coverImageFileId: 'coverImageUrl'
  };

  return Promise.all(
    playlistItems.map(async (item) => {
      const newItem = { ...item };
      const contentIds = newItem.data.contentIds;

      for (const [key, value] of Object.entries(urlFieldNames)) {
        if (item.data[key]) {
          newItem.data[value] = await getFile(item.data[key]);
          delete newItem.data[key];
        }
      }

      if (contentIds && contentIds.length > 0) {
        const contentData = await Promise.all(
          contentIds.map(async (contentId: string) => {
            const contentItem = await content.getContentById(contentId);
            return contentItem?.dataValues;
          })
        );

        const filteredContentData = contentData.filter((item) => item !== undefined);
        const contentItems = filteredContentData.map(getApiResultFromDbRow);
        const transformedContent = await transformContentSimple(contentItems);

        newItem.contentItems = transformedContent;
      }

      return newItem;
    })
  );
}

export async function transformContentSimple(contentItems: any[]) {
  const urlFieldNames = {
    coverImageFileId: 'coverImageUrl'
  };

  return Promise.all(
    contentItems.map(async (item) => {
      const newItem = { ...item };

      // Process URL fields
      for (const [key, value] of Object.entries(urlFieldNames)) {
        if (item[key]) {
          newItem[value] = await getFile(item[key]);
          delete newItem[key];
        }
      }

      return newItem;
    })
  );
}

export async function transformContent(contentItems: any[]) {
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
          newItem[value] = await getFile(item[key]);
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

  async function fetchCollaboratorInfo(collaborators: string[]) {
    const collaboratorInfoList = [];

    for (const collaboratorId of collaborators) {
      if (collaboratorId) {
        try {
          const profileData = await profile.selectProfileByID(collaboratorId);
          if (profileData) {
            const { organization, logofileid, tag } = profileData;
            let logoUrl = null;

            if (logofileid) {
              try {
                const fileResponse = await getFile(logofileid);
                logoUrl = (fileResponse?.playerInfo as NonVideoPlayerInfo)?.publicUrl;
              } catch (fileError) {
                console.error(`Failed to fetch file from Cloudflare for collaborator ${collaboratorId}:`, fileError);
              }
            }

            collaboratorInfoList.push({ organization, logoUrl, tag });
          }
        } catch (error) {
          console.error(`Failed to fetch info for collaborator ${collaboratorId}:`, error);
        }
      }
    }

    return collaboratorInfoList;
  }
}
