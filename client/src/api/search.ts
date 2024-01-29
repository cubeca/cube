import {
  SearchResponse,
  SearchFilters
} from '@cubeca/cube-svc-client-oas-axios';
import { bffApi } from '.';

/**
 * Perform a search using the BFF API.
 * @param searchTerm - The search term to use in the search query.
 * @param offset - The offset for pagination.
 * @param limit - The limit of results per page.
 * @param filters - Optional filters to apply to the search.
 * @returns An object containing content and profile results.
 */
export const search = async (
  searchTerm: string,
  offset: number,
  limit: number,
  filters?: SearchFilters
) => {
  const data = await bffApi.search(searchTerm, offset, limit, filters);
  const search: SearchResponse = data.data;
  return {
    contentResults: search.contentResults.data,
    profileResults: search.profileResults.data
  };
};

/**
 * Perform a content search using the BFF API.
 * @param searchTerm - The search term to use in the search query.
 * @param offset - The offset for pagination.
 * @param limit - The limit of results per page.
 * @param filters - Optional filters to apply to the search.
 * @returns An array of content results.
 */
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
