import { getAnonToken } from 'utils/authToken';
import { contentApi } from './httpClient';

export const getCollaborators = async () => {
  const anonToken = await getAnonToken();
  const collaboratorsApi = await contentApi.collaboratorList({
    headers: {
      authorization: `BEARER ${anonToken}`
    }
  });
  return await collaboratorsApi();
};
