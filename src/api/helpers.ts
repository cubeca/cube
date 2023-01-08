import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, UPLOADS_API_PATH } from './constants';
import { PaginationQueryKeys, ContentQueryKeys } from './enums';
import { Upload } from 'tus-js-client';

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

export const upload = (file: File) => {
  const upload = new Upload(file, {
    endpoint: `${UPLOADS_API_PATH}/`,
    retryDelays: [0, 3000, 5000, 10000, 20000],
    metadata: {
      filename: file.name,
      filetype: file.type
    },
    onError: function (error: Error) {
      console.log('Failed because: ' + error);
    },
    onProgress: function (bytesUploaded: number, bytesTotal: number) {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      console.log(bytesUploaded, bytesTotal, percentage + '%');
    },
    onSuccess: function () {
      console.log(
        'Download %s from %s',
        (upload.file as File).name,
        upload.url
      );
    }
  });

  // Check if there are any previous uploads to continue.
  upload.findPreviousUploads().then(function (previousUploads) {
    // Found previous uploads so we select the first one.
    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0]);
    }

    // Start the upload
    upload.start();
  });
};
