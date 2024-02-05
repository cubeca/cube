import express, { Request, Response } from 'express';
import * as db from './db/queries/playlist';
import * as contentQueries from './db/queries/content';
import { getApiResultFromDbRow, transformContent, transformPlaylist } from 'utils/utils';
import { extractUser } from 'middleware/auth';

export const playlist = express.Router();

playlist.get('/playlist/:playlistId', async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId;
  if (!playlistId) {
    return res.status(400).send('Invalid playlist Id');
  }

  const dbResult = await db.getPlaylistById(playlistId);
  if (!dbResult) {
    return res.status(404).send('Playlist not found');
  }

  return res.status(200).json(dbResult);
});

playlist.get('/playlist', async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const profileId = req.query.profileId as string;
  const userId = req.query.userId as string;
  const filters = req.query.filters ?? {};

  const dbResult = await db.listPlaylistsByProfileAndUserId(offset, limit, filters, profileId, userId);
  const data = dbResult.map(getApiResultFromDbRow);

  res.status(200).json(data);
});

playlist.post('/playlist', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { profileId, ...playlistData } = req.body;

    // Validate request body
    if (Object.keys(playlistData).length === 0) {
      return res.status(400).send('Invalid request body');
    }

    // Insert playlist into database
    const r = await db.insertPlaylist({ userId: user.uuid, profileId, ...playlistData });
    const dbResult = r?.dataValues;

    return res.status(201).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error creating the playlist', error);
    return res.status(500).send('Error creating the playlist');
  }
});

playlist.post('/playlist/:playlistId', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { ...playlistData } = req.body;
    const { playlistId } = req.params;

    // Validate request body and parameters
    if (!user.uuid || Object.keys(playlistData).length === 0 || !playlistId) {
      return res.status(400).send('Invalid request body or parameters');
    }

    // Check that the user updating playlist is indeed associated to the playlist submitted in the request
    const isUserAssociated = await db.isUserAssociatedToPlaylist(user.uuid, playlistId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to update playlist');
    }

    const dbResult = await db.updatePlaylist(playlistId, { ...playlistData });

    return res.status(200).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error updating the playlist', error);
    return res.status(500).send('Error updating the playlist');
  }
});

playlist.delete('/playlist/:playlistId', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { playlistId } = req.params;

    // Validate request parameters
    if (!playlistId) {
      return res.status(400).send('Invalid request parameters');
    }

    // Retrieve playlist item to delete
    const playlist = await db.getPlaylistById(playlistId);
    if (!playlist) {
      return res.status(404).send('Playlist not found');
    }

    // Check if user is associated with the profile of the content item
    //@ts-ignore
    const isUserAssociated = await db.isUserAssociatedToPlaylist(user.uuid, playlistId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to delete this playlist');
    }

    // Delete playlist in the database
    const dbResult = await db.deletePlaylist(playlistId);
    return res.status(200).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error deleting playlist', error);
    return res.status(500).send('Could not delete playlist');
  }
});
