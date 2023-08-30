import { getProfileByTag } from 'api/profile';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getProfileId } from 'utils/auth';

const useProfile = () => {
  const { tag } = useParams();
  const profileId = getProfileId();

  const { isLoading, isError, data } = useQuery(
    ['profile_by_tag', tag],
    () => getProfileByTag(tag ?? ''),
    { enabled: !!tag }
  );

  const profile = data?.data.data;

  return {
    isLoading: isLoading,
    isError,
    data: {
      ...profile,
      profileId
    }
  };
};

export default useProfile;
