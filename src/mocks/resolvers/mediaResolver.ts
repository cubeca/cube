import { defaultContext, MockedRequest, ResponseComposition } from 'msw';

type ContextType = typeof defaultContext;

export const addMedia = async (
  req: MockedRequest,
  res: ResponseComposition,
  ctx: ContextType
) => {
  const data = await req.json();
  console.log(data);
  return res(
    ctx.status(201),
    (ctx as any).json({
      data: {
        id: 'abc123'
      }
    })
  );
};
