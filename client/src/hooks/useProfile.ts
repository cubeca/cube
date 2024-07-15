/**
 * `useProfile` is a custom React hook that fetches profile information based on a profile tag. The hook is designed to retrieve a profile 
 * either by a tag provided directly as an argument or by a tag obtained from the URL parameters.

 * The hook first attempts to use a `tag` argument if provided; if not, it falls back to using a `tag` obtained from the URL parameters 
 * via `useParams`. It also retrieves the current user's profile ID using the `getProfileId` utility function.

 * @param {string} [tag] - Optional. The tag of the profile to fetch. If not provided, the hook will attempt to use a tag from the 
 * URL parameters.
 * @returns {Object} An object containing:
 *   - `isLoading`: A boolean indicating if the profile data is currently being fetched.
 *   - `isError`: A boolean indicating if an error occurred during the fetching process.
 *   - `data`: An object containing the fetched profile data, enriched with the `profileId` of the current user.
 *   - `refetch`: A function to manually trigger a refetch of the profile data.
 */

import { getProfileByTag } from 'api/profile';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProfileId } from 'utils/auth';

const useProfile = (tag?: string) => {
  const { tag: paramTag } = useParams();
  const profileId = getProfileId();

  const { isLoading, isError, data, refetch } = useQuery(
    ['profile_by_tag', tag],
    () => getProfileByTag(tag ?? paramTag ?? ''),
    { enabled: !!tag || !!paramTag }
  );

  const profile = data?.data.data;

  return {
    isLoading,
    isError,
    data: {
      ...profile,
      profileId
    },
    refetch
  };
};

export default useProfile;
