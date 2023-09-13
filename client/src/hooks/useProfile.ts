import { getProfileByTag } from 'api/profile';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProfileId } from 'utils/auth';

const useProfile = (tag?: string) => {
  const { tag: paramTag } = useParams();
  const profileId = getProfileId();

  const { isLoading, isError, data } = useQuery(
    ['profile_by_tag', tag],
    () => getProfileByTag(tag ?? paramTag ?? ''),
    { enabled: !!tag || !!paramTag}
  );

  const profile = data?.data.data;

  return {
    isLoading,
    isError,
    data: {
      ...profile,
      profileId
    }
  };
};

export default useProfile;
