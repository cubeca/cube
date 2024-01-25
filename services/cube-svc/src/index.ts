import express, { Express } from 'express';
import cors from 'cors';

export const app: Express = express();
app.use(cors());
app.use(express.json());

app.get('/search', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  type ServiceResult = {
    status: number | null;
    data: any | null;
    error: string | null;
    meta: any;
  };

  const scope: string | undefined = req.query.scope as string | undefined;

  const searchContentResult: ServiceResult = { status: null, data: null, error: null, meta: null };
  const searchProfileResult: ServiceResult = { status: null, data: null, error: null, meta: null };

  const filters: any = {};
  Object.keys(req.query).forEach((key) => {
    if (key.startsWith('filters.')) {
      const filterKey = key.substring('filters.'.length);
      filters[filterKey] = req.query[key];
      delete req.query[key];
    }
  });

  req.query.filters = filters;

  if (!scope || scope === 'content') {
    try {
      const contentResponse = await contentApi.get('search/', {
        params: req.query,
        headers: filterHeadersToForward(req, 'authorization')
      });

      const contentToTransform = await Promise.all(
        contentResponse.data.data.map(async (item: any) => {
          Object.assign(item, item.data);
          delete item.data;
          return item;
        })
      );

      searchContentResult.meta = contentResponse.data.meta;
      searchContentResult.status = contentResponse.status;
      searchContentResult.data = await transformContent(contentToTransform, filterHeadersToForward(req, 'authorization'));
    } catch (error: any) {
      searchContentResult.status = error.response?.status || 500;
      searchContentResult.error = error.message;
    }
  }

  if (!scope || scope === 'profile') {
    try {
      const profileResponse = await profileApi.get('search/', {
        params: req.query,
        headers: filterHeadersToForward(req, 'authorization')
      });

      searchProfileResult.meta = profileResponse.data.meta;
      searchProfileResult.status = profileResponse.status;
      searchProfileResult.data = profileResponse.data.data;
    } catch (error: any) {
      searchProfileResult.status = error.response?.status || 500;
      searchProfileResult.error = error.message;
    }
  }

  const responsePayload: any = {};

  if (!scope || scope === 'content') {
    responsePayload.contentResults = {
      meta: searchContentResult.meta,
      data: searchContentResult.data,
      status: searchContentResult.status,
      error: searchContentResult.error
    };
  }

  if (!scope || scope === 'profile') {
    responsePayload.profileResults = {
      meta: searchProfileResult.meta,
      data: searchProfileResult.data,
      status: searchProfileResult.status,
      error: searchProfileResult.error
    };
  }

  res.status(200).json(responsePayload);
});
