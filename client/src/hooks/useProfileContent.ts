/**
 * `useContentDetails` is a custom React hook that fetches content details associated with a given profile ID, utilizing the 
 * `getContentByProfileId` function imported from the `api/content` module.

 * @param {string} profileId - The ID of the profile for which content details are to be fetched.
 * @returns {ContentDetailsResponse} An object containing:
 *   - `isLoading`: A boolean indicating if the content details are currently being fetched.
 *   - `isError`: A boolean indicating if an error occurred during the fetching process.
 *   - `data`: The fetched content details, typed as `ContentStorage`.
 */

import { getContentByProfileId } from 'api/content';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ContentStorage } from '@cubeca/cube-svc-client-oas-axios';

interface ContentDetailsResponse {
  isLoading: boolean;
  isError: boolean;
  data?: ContentStorage;
}
const useContentDetails = (profileId: string): ContentDetailsResponse => {
  const { isLoading, isError, data } = useQuery(
    ['profile', profileId],
    () => getContentByProfileId(profileId ?? ''),
    { enabled: !!profileId }
  );

  return {
    isLoading,
    isError,
    data: data?.data as unknown as ContentStorage
  };
};

export default useContentDetails;
