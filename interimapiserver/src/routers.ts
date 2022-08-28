import * as express from "express";
import { Request, Response } from "express";

import { PROFILE } from './mocks/fixtures/profileFixtures';
import { FEATURED_VIDEOS, VIDEO_DETAILS } from './mocks/fixtures/videosFixtures';

export const profileRouter = express.Router();
export const videoRouter = express.Router();

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

videoRouter.get('/', async (req: Request, res: Response) => {
    try {
        res.status(200).send({
            data: {...FEATURED_VIDEOS}
            // data: "{...FEATURED_VIDEOS}"
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

videoRouter.get('/:id', async (req: Request, res: Response) => {
    // const id: number = parseInt(req.params.id, 10);
    try {
        res.status(200).send({
            data: VIDEO_DETAILS
            // data: "VIDEO_DETAILS"
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});
