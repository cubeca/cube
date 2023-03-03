import axios from 'axios';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constants';
import { PaginationQueryKeys, ContentQueryKeys } from './enums';
import { Upload, HttpRequest, HttpResponse } from 'tus-js-client';
import { UPLOAD_TUS_ENDPOINT, uploadApi } from './httpClient';
import { getAuthToken } from '../utils/authToken';

type QueryKeys = typeof ContentQueryKeys;

const setPaginationParams = (params: URLSearchParams) => {
  // Set Paging defaults if no paging provided
  if (!params.has(PaginationQueryKeys.Page))
    params.set(PaginationQueryKeys.Page, `${DEFAULT_PAGE}`);
  if (!params.has(PaginationQueryKeys.PageSize))
    params.set(PaginationQueryKeys.PageSize, `${DEFAULT_PAGE_SIZE}`);

  return params;
};

const scrubRequestParams = (params: URLSearchParams, keys: QueryKeys) => {
  params.forEach((value, key) => {
    if (!(<any>Object).values(keys).includes(key)) {
      params.delete(key);
    }
  });
};

export const getRequestParams = (keys: QueryKeys, params?: URLSearchParams) => {
  const paramsCopy = new URLSearchParams(`${params || ''}`);

  if (params) {
    scrubRequestParams(paramsCopy, keys);
  }

  setPaginationParams(paramsCopy);

  return `${paramsCopy}`;
};

export const blobToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


export type ProgressHandler = (bytesUploaded: number, bytesTotal: number) => void;

const defaultProgressHandler: ProgressHandler = (bytesUploaded: number, bytesTotal: number) => {
  const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
  console.log(`uploadViaTus ${bytesUploaded}/${bytesTotal} = ${percentage}%`);
}

export const uploadViaTus = async (file: File, meta: any, progressHandler: ProgressHandler = defaultProgressHandler):Promise<string | undefined> => {
  const authToken = await getAuthToken();
  return await new Promise((resolve, reject) => {
    let fileId: string | undefined = undefined;

    const options = {
      endpoint: UPLOAD_TUS_ENDPOINT,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        fileName: file.name,
        mimeType: file.type,
        ...meta
      },
      onAfterResponse(req: HttpRequest, res: HttpResponse) {
        if (res.getStatus() === 200 && req.getURL() === UPLOAD_TUS_ENDPOINT) {
          fileId = res.getHeader("CUBE-File-Id");
          resolve(fileId); // Resolve early, so we can get on with creating content.
        }
      },
      onError(error: any) {
        reject(error);
      },
      onProgress: progressHandler,
      onSuccess() {
        resolve(fileId);
      },
    }

    const upload = new Upload(file, options);

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads:any) {
      // Found previous uploads so we select the first one. 
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    })
  });
};


export const uploadS3 = async (file: File, profileId: string): Promise<string | undefined> => {
  const fileName = file.name;
  const mimeType = file.type;
  const fileSizeBytes = file.size;

  const { data: { fileId, presignedUrl } } = await uploadApi.uploadFilesViaPresignedUrl({
    profileId,
    upload: {
      fileName,
      fileSizeBytes,
      mimeType,
      urlValidDurationSeconds: 5 * 60
    }
  });

  const r2PutOptions = {
    timeout: 10 * 60 * 1000,

    // Do not throw errors for non-2xx responses, that makes handling them easier.
    validateStatus: null,

    headers: {
      'Content-Type': mimeType,
      'Content-Length': fileSizeBytes,
    },

    onUploadProgress: (progressEvent:any) => {
      console.log(`profile ${profileId} uploadS3 progress for ${fileName}`);
      console.dir(progressEvent);
    }
  };

  // Do *NOT* wait, intentionally.
  // TODO Improve async error handling and progress reporting. 
  axios.put(presignedUrl, file, r2PutOptions);

  return fileId;
};
