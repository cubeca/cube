/**
 * `useCollaborators` is a custom React hook for fetching and managing collaborators data from the API. It encapsulates the logic
 * for the loading and error handling of the collaborators' information.
 *
 * The hook returns an object containing three properties: `isLoading`, `isError`, and `data`. `isLoading` is a boolean indicating
 * whether the request is in progress, `isError` is a boolean indicating whether the request resulted in an error, and `data` contains
 * the actual data returned from the API, formatted to only include the `data` property of the response.
 * @returns {Object} An object containing the following properties:
 * - `isLoading`: Boolean indicating if the query is in progress.
 * - `isError`: Boolean indicating if the query resulted in an error.
 * - `data`: The data returned from the `getCollaborators` API call, specifically the `data` property of the response.
 */

import { getCollaborators } from 'api/collaborators';
import { useQuery } from '@tanstack/react-query';

const useCollaborators = () => {
  const { isLoading, isError, data } = useQuery(['collaborators'], () =>
    getCollaborators()
  );

  return {
    isLoading,
    isError,
    data: data?.data
  };
};

export default useCollaborators;
