import { Buffer } from 'node:buffer';

export const base64encode = (s: any) => Buffer.from(String(s), 'utf8').toString('base64');
export const base64decode = (b64: any): string | Buffer | undefined => {
  let decoded = undefined;
  try {
    decoded = Buffer.from(String(b64), 'base64');
  }
  catch (err: any) {
    return undefined;
  }
  try {
    return decoded.toString('utf8');
  }
  catch (err: any) {
    return decoded;
  }
}

export interface UploadMetadata {
  reserveDurationSeconds?: number;
  isPrivate?: boolean;
  urlValidDurationSeconds?: number;
  uploadingUserId?: string;
}

export const makeCloudflareTusUploadMetadata = ({
  reserveDurationSeconds,
  isPrivate,
  urlValidDurationSeconds,
  uploadingUserId
}:UploadMetadata = {}) => {
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

export const parseTusUploadMetadata = (headerValues: string | string[]):any => {
  const parsed: { [k: string]: string | true | Buffer | undefined } = {};
  for (const headerValue of Array.isArray(headerValues) ? headerValues : [headerValues]) {
    for (const [metaName, metaValue] of headerValue.split(',').map((m: string) => m.split(' '))) {
      parsed[metaName] = (!metaValue) ? true : base64decode(metaValue);
    }
  }
  return parsed
};
