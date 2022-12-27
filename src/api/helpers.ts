import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constants';
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
