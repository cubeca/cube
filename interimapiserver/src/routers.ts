import * as express from 'express';
import { Request, Response } from 'express';
import axios from 'axios';

import { PROFILE } from './mocks/fixtures/profileFixtures';
import {
  FEATURED_CONTENT,
  CONTENT_DETAILS
} from './mocks/fixtures/contentFixtures';
import { CLOUDFLARE_API_TOKEN, CLOUDFLARE_API_STREAM } from './api/constants';

export const profileRouter = express.Router();
export const contentRouter = express.Router();

profileRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    res.status(200).send({
      data: PROFILE
      // data: "PROFILE"
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

profileRouter.get('/:id/collaborators', async (req: Request, res: Response) => {
  try {
    res.status(200).send({
      data: { collaborators: ['collab1,collab2,collab3'] }
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

contentRouter.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send({
      data: { ...FEATURED_CONTENT }
      // data: "{...FEATURED_CONTENT}"
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

contentRouter.get('/get-upload-url', async (req: Request, res: Response) => {
  console.log(req.headers);
  if (!req.headers['upload-length']) {
    res.status(400).send(`Invalid Request Header. 'upload-length' required`);
  }
  try {
    const response = await axios.post(CLOUDFLARE_API_STREAM, null, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${CLOUDFLARE_API_TOKEN}`,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': req.headers['upload-length'] as string,
        'Upload-Metadata': req.headers['Upload-Metadata'] as string
      }
    });

    const destination = response.headers['location'];

    res.set({
      'Access-Control-Expose-Headers': 'Location',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
      Location: destination
    });
    res.status(200).send('OK');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

contentRouter.get('/:id', async (req: Request, res: Response) => {
  // const id: number = parseInt(req.params.id, 10);
  try {
    res.status(200).send({
      data: CONTENT_DETAILS
      // data: "CONTENT_DETAILS"
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
