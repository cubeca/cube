import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import type { ContentData } from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf } from './auth';

const app: Express = express();
app.use(cors());
app.use(express.json());

const getApiResultFromDbRow = (r: any) => ({
  id: r.id,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  ...r.data
});

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const newContent: ContentData = req.body as ContentData;
  const dbResult = await db.insertContent(newContent, newContent.profileId);
  res.status(201).json(getApiResultFromDbRow(dbResult));
});

app.get('/content', async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const profileId = req.query.profileId;
  const dbResult = await db.listContentByProfileId(offset, limit, profileId as string);

  res.status(200).json({
    meta: {
      offset,
      limit
    },
    data: dbResult.map(getApiResultFromDbRow)
  });
});

app.get('/content/:contentId', async (req: Request, res: Response) => {
  res.status(200).json(getApiResultFromDbRow(await db.getContentById(req.params.contentId)));
});

app.post('/content/:contentId', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  const newContent: ContentData = req.body as ContentData;
  const dbResult = await db.updateContent(newContent, req.params.contentId);
  res.status(201).json(getApiResultFromDbRow(dbResult));
});

app.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send('Service is running');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.delete('/content/:contentId', async (req: Request, res: Response) => {
  res.status(200).json(getApiResultFromDbRow(await db.deleteContent(req.params.contentId)));
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
