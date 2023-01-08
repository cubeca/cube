import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';

const inspect = (...things: any) =>
  things.forEach((thing: any) =>
    console.dir(thing, { depth: null, color: true })
  );

dotenv.config();

export const APP_URL: string = process.env.REACT_APP_ORIGIN || '';
export const API_URL: string = process.env.REACT_APP_API_URL || '';

export const DEFAULT_API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`;

import { PROFILE_API_PATH, CONTENT_API_PATH } from './api/constants';

import { profileRouter, contentRouter } from './routers';

// inspect({ profileRouter, contentRouter });

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

const uploadApp = express();
const server = new Server({
  datastore: new FileStore({ directory: './files' }),
  path: '/files'
});

uploadApp.all('*', server.handle.bind(server));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', uploadApp);

app.use(PROFILE_API_PATH, profileRouter);
app.use(CONTENT_API_PATH, contentRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
