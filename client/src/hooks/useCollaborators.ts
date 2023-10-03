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
