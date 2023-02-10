import { CollaboratorsAPIResponse } from 'types/collaborators';
import { COLLABORATORS_API_PATH } from './constants';
import httpClient from './httpClient';

export const getCollaborators = () =>
  httpClient.get<CollaboratorsAPIResponse>(`${COLLABORATORS_API_PATH}`);
