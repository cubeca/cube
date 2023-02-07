import { contentApi } from './httpClient';

export const getCollaborators = async () => {
  const collaboratorsApi = await contentApi.collaboratorList();
  return await collaboratorsApi();
};
