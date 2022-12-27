import * as express from 'express';
import { Request, Response } from 'express';

import { PROFILE } from './mocks/fixtures/profileFixtures';
import {
  FEATURED_CONTENT,
  CONTENT_DETAILS
} from './mocks/fixtures/contentFixtures';

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
