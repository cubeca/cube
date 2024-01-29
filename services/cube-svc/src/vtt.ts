import express, { Request, Response } from 'express';
import * as db from './db/queries/content';
import { allowIfAnyOf, extractUser } from './middleware/auth';

const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

export const vtt = express.Router();

vtt.get('/vtt/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send('Invalid request parameters');
    }

    const result = await db.getVTTById(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error getting VTT', error);
    return res.status(500).send('Error getting VTT');
  }
});

vtt.put('/vtt/:id', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;

    if (!id || !transcript) {
      return res.status(400).send('Invalid request parameters');
    }

    const user = extractUser(req);
    const content = await db.getContentById(id);

    //@ts-ignore
    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, content.data.profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to update content for this profile');
    }

    const result = await db.updateVTT(id, transcript);
    const dataBuffer = Buffer.from(id);
    await pubsub.topic('vtt_upload').publishMessage({ data: dataBuffer });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error updating VTT', error);
    return res.status(500).send('Error updating VTT');
  }
});
