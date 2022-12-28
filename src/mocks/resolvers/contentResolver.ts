import { defaultContext, MockedRequest, ResponseComposition } from 'msw';
import { FEATURED_CONTENT, CONTENT_DETAILS } from '../fixtures/contentFixtures';

type ContextType = typeof defaultContext;

export const getFeatured = (
  req: MockedRequest,
  res: ResponseComposition,
  ctx: ContextType
) => {
  return res(
    ctx.status(200),
    (ctx as any).json({
      data: {
        ...FEATURED_CONTENT
        // page_number: page,
        // page_size,
        // total_entries: transactions.length,
        // total_pages: Math.ceil(transactions.length / page_size)
      }
    })
  );
};

export const getSingle = (
  req: MockedRequest,
  res: ResponseComposition,
  ctx: ContextType
) => {
  return res(
    ctx.status(200),
    (ctx as any).json({
      data: CONTENT_DETAILS
    })
  );
};

export const addContent = async (
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
