import * as dotenv from "dotenv";
import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";

const inspect = (...things: any) => things.forEach((thing: any) => console.dir(thing, { depth : null, color:true}));

dotenv.config();

export const APP_URL: string = process.env.REACT_APP_ORIGIN || '';
export const API_URL: string = process.env.REACT_APP_API_URL || '';

export const DEFAULT_API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`;

export const VIDEOS_API_PATH = `${API_URL}${API_BASE_PATH}/videos`;
export const PROFILE_API_PATH = `${API_URL}${API_BASE_PATH}/profiles`;

import { PROFILE_API_PATH, VIDEOS_API_PATH } from './api/constants';

import { profileRouter, videoRouter } from './routers';

// inspect({ profileRouter, videoRouter });


if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(PROFILE_API_PATH, profileRouter);
app.use(VIDEOS_API_PATH, videoRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
