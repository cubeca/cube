import { bffApi } from '.';

export const getCollaborators = async () => {
  return await bffApi.collaborators();
};
