import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './settings';
import { PaginationQueryKeys, ContentQueryKeys } from './enums';

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

export const makeUUID = () => {
  const randHex = () => '0123456789abcdef'[Math.floor(Math.random() * 16)];
  const randRest = () => '89ab'[Math.floor(Math.random() * 4)];
  return '00000000-0000-4000-8000-000000000000'.replaceAll('8', randRest).replaceAll('0', randHex);
};
