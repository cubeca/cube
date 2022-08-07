import { defaultContext, MockedRequest, ResponseComposition } from 'msw';
import { PROFILE } from '../fixtures/profileFixtures';

type ContextType = typeof defaultContext;

export const getProfile = (
  req: MockedRequest,
  res: ResponseComposition,
  ctx: ContextType
) => {
  return res(
    ctx.status(200),
    (ctx as any).json({
      data: PROFILE
    })
  );
};
