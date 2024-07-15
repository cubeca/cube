/**
 * `useFilterContent` is a custom React hook for content filtering. It provides a convenient interface for setting and retrieving 
 * filters applied to content queries based on URL search parameters.

 * The hook leverages `useSearchParams` to access and manipulate the search parameters in the URL, `useNavigate` to programmatically 
 * navigate to the updated URL with the new search parameters, and `useLocation` to access the current location object.

 * It exposes two main functions: `setFilter` and `getFilter`. `setFilter` allows setting a filter by updating the search parameters 
 * in the URL. If the value for a filter is empty, it removes the filter from the URL. `getFilter` retrieves the value of a specific 
 * filter from the search parameters.
 * 
 * @returns {Object} An object containing:
 *   - `setFilter`: A function to set or update a filter in the URL search parameters. It takes a `key` of type `ContentQueryKeys` 
 *      (an enum defining valid filter keys) and a `value` as a string. If the `value` is empty, the filter is removed from the URL.
 *   - `getFilter`: A function to retrieve the current value of a filter from the URL search parameters. It takes a `key` of type `
 *      ContentQueryKeys` and returns the value as a string or `null` if the filter is not set.
 */

import { ContentQueryKeys } from 'api/enums';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const useFilterContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const setFilter = (key: ContentQueryKeys, value: string) => {
    if (!value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    navigate(`${location.pathname}${searchParams ? `?${searchParams}` : ''}`);
  };

  const getFilter = (key: ContentQueryKeys) => {
    return searchParams.get(key);
  };

  return {
    setFilter,
    getFilter
  };
};

export default useFilterContent;
