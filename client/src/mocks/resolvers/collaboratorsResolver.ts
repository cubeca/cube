import { COLLABORATORS } from 'mocks/fixtures/collaboratorsFixtures';
import { defaultContext, MockedRequest, ResponseComposition } from 'msw';

type ContextType = typeof defaultContext;

export const getCollaborators = (
  req: MockedRequest,
  res: ResponseComposition,
  ctx: ContextType
) => {
  return res(
    ctx.status(200),
    (ctx as any).json({
      data: {
        collaborators: COLLABORATORS
      }
    })
  );
};
