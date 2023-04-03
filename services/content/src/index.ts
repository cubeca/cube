import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import type { ContentData } from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { inspect } from './utils';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const newContent: ContentData = req.body as ContentData;
  const dbResult = await db.insertContent(newContent, newContent.profileId);
  res.status(201).json({
    id: dbResult.id,
    createdAt: dbResult.created_at,
    updatedAt: dbResult.updated_at,
    ...dbResult.data
  });
});

app.get('/content', async (req: Request, res: Response) => {
  const { creator: profileId, page, page_size, category, type, nation, creator } = req.query;

  const dbResults = await db.listContentByProfileId(profileId as string);
  res.json(dbResults);
});

app.get('/content/:contentId', async (req: Request, res: Response) => {
  const { contentId } = req.params;

  const dbResult = await db.getContentById(contentId);
  res.json(dbResult);
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
