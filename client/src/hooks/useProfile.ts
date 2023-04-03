import { getProfile } from 'api/profile';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ProfileMainSchema } from '@cubeca/bff-client-oas-axios';

const useProfile = () => {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery(
    ['profile', id],
    () => getProfile(id ?? ''),
    { enabled: !!id }
  );

  return {
    isLoading,
    isError,
    data: data?.data as unknown as ProfileMainSchema
  };
};

export default useProfile;
