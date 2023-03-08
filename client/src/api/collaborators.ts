import { contentApi } from './httpClient';

export const getCollaborators = async () => {
  return await contentApi.collaboratorList();
};
