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

export const updateProfileSection = async (
  req: MockedRequest,
  res: ResponseComposition,
  ctx: ContextType
) => {
  const data = await req.json();
  console.log(data);

  return res(
    ctx.status(200),
    (ctx as any).json({
      data: {
        ...PROFILE,
        name: data.name,
        description: data.description
      }
    })
  );
};

export const updateProfileLogo = async (
  req: MockedRequest,
  res: ResponseComposition,
  ctx: ContextType
) => {
  return res(
    ctx.status(200),
    (ctx as any).json({
      data: {
        ...PROFILE
      }
    })
  );
};
