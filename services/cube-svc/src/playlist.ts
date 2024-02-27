import express, { Request, Response } from 'express';
import * as db from './db/queries/playlist';
import { getApiResultFromDbRow, transformPlaylist } from './utils/utils';
import { allowIfAnyOf, extractUser } from './middleware/auth';

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

  const transformedPlaylist = await transformPlaylist([dbResult.dataValues]);
  return res.status(200).json(transformedPlaylist);
});

playlist.get('/playlist', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const profileId = req.query.profileId as string;
  const userId = req.query.userId as string;

  const dbResult = await db.listPlaylistsByProfileAndUserId(offset, limit, profileId, userId);
  const playlistList = dbResult.map((item) => item.dataValues);
  const transformedPlaylist = await transformPlaylist(playlistList);
  res.status(200).json(transformedPlaylist);
});

playlist.post('/playlist', allowIfAnyOf('active'), async (req: Request, res: Response) => {
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

playlist.post('/playlist/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
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
    return res.status(200).json(getApiResultFromDbRow(dbResult?.dataValues));
  } catch (error) {
    console.error('Error updating the playlist', error);
    return res.status(500).send('Error updating the playlist');
  }
});

playlist.post('/playlist/addContent/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { playlistId } = req.params;
    const { contentId } = req.body;

    // Validate request body and parameters
    if (!playlistId || !contentId) {
      return res.status(400).send('Invalid request body or parameters');
    }

    // Check that the user updating playlist is indeed associated to the playlist submitted in the request
    const isUserAssociated = await db.isUserAssociatedToPlaylist(user.uuid, playlistId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to update playlist');
    }

    const dbResult = await db.addContentToPlaylist(playlistId, contentId);
    if (dbResult) {
      return res.status(200).json(getApiResultFromDbRow(dbResult[1][0]));
    } else {
      return res.status(500).send('Error adding content to the playlist');
    }
  } catch (error) {
    console.error('Error adding content to the playlist', error);
    return res.status(500).send('Error adding content to the playlist');
  }
});

playlist.post('/playlist/removeContent/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { playlistId } = req.params;
    const { contentId } = req.body;

    // Validate request body and parameters
    if (!playlistId || !contentId) {
      return res.status(400).send('Invalid request body or parameters');
    }

    // Check that the user updating playlist is indeed associated to the playlist submitted in the request
    const isUserAssociated = await db.isUserAssociatedToPlaylist(user.uuid, playlistId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to update playlist');
    }

    const dbResult = await db.removeContentFromPlaylist(playlistId, contentId);
    if (dbResult) {
      return res.status(200).json(getApiResultFromDbRow(dbResult[1][0]));
    } else {
      return res.status(500).send('Error removing content from the playlist');
    }
  } catch (error) {
    console.error('Error removing content from the playlist', error);
    return res.status(500).send('Error removing content from the playlist');
  }
});

playlist.delete('/playlist/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
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
    return res.status(200).json(dbResult);
  } catch (error) {
    console.error('Error deleting playlist', error);
    return res.status(500).send('Could not delete playlist');
  }
});
