import path from 'node:path';

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { inspect } from './utils';
import { inspect } from './microservices';

inspect(Object.entries(spec.paths).map(([path, pathItem]) => [path, pathItem.operationId]));

const app: Express = express();

app.use(cors());
app.use(express.json());

app.post('/upload/video-tus-reservation', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => { });
app.post('/upload/s3-presigned-url', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => { });
app.get('/files/:fileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => { });

app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => { });
app.get('/content', async (req: Request, res: Response) => { });
app.get('/content/:contentId', async (req: Request, res: Response) => { });

app.post('/auth/user', allowIfAnyOf('anonymous', 'userAdmin'), async (req: Request, res: Response) => { });
app.post('/auth/login', async (req: Request, res: Response) => { });
app.post('/auth/anonymous', async (req: Request, res: Response) => { });
app.put('/auth/email', allowIfAnyOf('active'), async (req: Request, res: Response) => { });
app.put('/auth/password', allowIfAnyOf('active'), async (req: Request, res: Response) => { });
app.get('/auth/verify', allowIfAnyOf('unverified'), async (req: Request, res: Response) => { });
app.get('/auth/forgot-password', async (req: Request, res: Response) => { });

app.post('/profiles', async (req: Request, res: Response) => { });
app.get('/profiles/:id', async (req: Request, res: Response) => { });

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  console.error(err);
  res.status(status).json({
    status,
    message: err?.message,
    errors: err?.errors,
  });
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
