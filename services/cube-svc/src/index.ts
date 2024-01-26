import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import * as settings from './settings';
import * as contentQueries from './db/queries/content';
import * as profileQueries from './db/queries/profile';

import { allowIfAnyOf } from './middleware/auth';
import { transformContent } from './utils/utils';

import { cloudflare } from './cloudflare';
import { profile } from './profile';
import { identity } from './identity';
import { content } from './content';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/', cloudflare);
app.use('/', profile);
app.use('/', identity);
app.use('/', content);

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

  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const searchTerm = (req.query.searchTerm as string) || '';

  const filters: any = {};
  Object.keys(req.query).forEach((key) => {
    if (key.startsWith('filters.')) {
      const filterKey = key.substring('filters.'.length);
      filters[filterKey] = req.query[key];
      delete req.query[key];
    }
  });

  if (!scope || scope === 'content') {
    try {
      const contentSearchResult = await contentQueries.searchContent(offset, limit, filters, searchTerm);

      searchContentResult.meta = {
        offset: offset,
        limit: limit,
        filters: filters
      };
      searchContentResult.status = 200;
      searchContentResult.data = await transformContent(contentSearchResult);
    } catch (error: any) {
      searchContentResult.status = error.response?.status || 500;
      searchContentResult.error = error.message;
    }
  }

  if (!scope || scope === 'profile') {
    try {
      const profileSearchResult = await profileQueries.searchProfiles(offset, limit, searchTerm);

      searchProfileResult.meta = {
        offset: offset,
        limit: limit,
        filters: filters
      };
      searchProfileResult.status = 200;
      searchProfileResult.data = profileSearchResult;
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

  return res.status(200).json(responsePayload);
});

app.get('/', async (_req: Request, res: Response) => {
  return res.status(200).send('Service is running');
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
