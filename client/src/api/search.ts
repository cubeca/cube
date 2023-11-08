import { BFFSearchResponse, SearchFilters } from '@cubeca/bff-client-oas-axios';
import { bffApi } from '.';

export const search = async (
  searchTerm: string,
  offset: number,
  limit: number,
  filters?: SearchFilters
) => {
  const data = await bffApi.search(searchTerm, offset, limit, filters);
  const search: BFFSearchResponse = data.data;
  return {
    contentResults: search.contentResults.data,
    profileResults: search.profileResults.data
  };
};

export const searchContent = async (
  searchTerm: string,
  offset: number,
  limit: number,
  filters?: SearchFilters
) => {
  const data = await bffApi.search(
    searchTerm,
    offset,
    limit,
    filters,
    'content'
  );
  const search: BFFSearchResponse = data.data;
  return search.contentResults.data;
};
