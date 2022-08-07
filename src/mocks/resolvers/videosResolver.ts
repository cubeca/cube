import { defaultContext, MockedRequest, ResponseComposition } from 'msw';
import { FEATURED_VIDEOS, VIDEO_DETAILS } from '../fixtures/videosFixtures';

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
        ...FEATURED_VIDEOS
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
      data: VIDEO_DETAILS
    })
  );
};
