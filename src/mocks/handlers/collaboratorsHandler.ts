import { COLLABORATORS_API_PATH } from 'api/constants';
import { RequestHandler, rest } from 'msw';
import { CollaboratorsAPIResponse } from 'types/collaborators';

import * as CollaboratorsResolver from '../resolvers/collaboratorsResolver';

export const fetchCollaborators = (): RequestHandler => {
  return rest.get<CollaboratorsAPIResponse>(
    COLLABORATORS_API_PATH,
    CollaboratorsResolver.getCollaborators
  );
};
