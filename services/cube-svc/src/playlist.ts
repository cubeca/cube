import express, { Request, Response } from 'express';
import * as db from './db/queries/playlist';
import { UUID_REGEXP, getApiResultFromDbRow, transformPlaylist } from './utils/utils';
import { allowIfAnyOf, extractUser } from './middleware/auth';

/**
 * Playlist Service
 *
 * This service handles playlist-related operations such as fetching, creating,
 * updating, deleting playlists, and managing content within playlists.
 *
 * @module PlaylistService
 */

export const playlist = express.Router();

/**
 * Route to fetch a playlist by its ID
 *
 * @function
 * @name get/playlist/:playlistId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Playlist details
 */
playlist.get('/playlist/:playlistId', async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId;
  if (!playlistId) {
    return res.status(400).send('Invalid playlist Id');
  }

  if (!UUID_REGEXP.test(playlistId)) {
    return res.status(400).send('Invalid parameter, must be in UUID format.');
  }

  const dbResult = await db.getPlaylistById(playlistId);
  if (!dbResult) {
    return res.status(404).send('Playlist not found');
  }

  const transformedPlaylist = await transformPlaylist([dbResult.dataValues]);
  return res.status(200).json(transformedPlaylist);
});

/**
 * Route to fetch playlists by profile or user ID
 *
 * @function
 * @name get/playlist
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} List of playlists
 */
playlist.get('/playlist', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const profileId = (req.query.profileId as string) || '';
  const userId = (req.query.userId as string) || '';

  const dbResult = await db.listPlaylistsByProfileOrUserId(offset, limit, profileId, userId);
  const playlistList = dbResult.map((item) => item.dataValues);
  const transformedPlaylist = await transformPlaylist(playlistList);
  res.status(200).json(transformedPlaylist);
});

/**
 * Route to create a new playlist
 *
 * @function
 * @name post/playlist
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} ID of the newly created playlist
 */
playlist.post('/playlist', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { profileId, ...playlistData } = req.body;

    if (Object.keys(playlistData).length === 0) {
      return res.status(400).send('Invalid request body');
    }

    const r = await db.insertPlaylist({ userId: user.uuid, profileId, ...playlistData });
    const dbResult = r?.dataValues;

    return res.status(201).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error creating the playlist', error);
    return res.status(500).send('Error creating the playlist');
  }
});

/**
 * Route to update an existing playlist by its ID
 *
 * @function
 * @name post/playlist/:playlistId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Updated playlist
 */
playlist.post('/playlist/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { ...playlistData } = req.body;
    const { playlistId } = req.params;

    if (!user.uuid || Object.keys(playlistData).length === 0 || !playlistId) {
      return res.status(400).send('Invalid request body or parameters');
    }

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

/**
 * Route to add content to a playlist
 *
 * @function
 * @name post/playlist/addContent/:playlistId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Updated playlist with new content
 */
playlist.post('/playlist/addContent/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { playlistId } = req.params;
    const { contentId } = req.body;

    if (!playlistId || !contentId) {
      return res.status(400).send('Invalid request body or parameters');
    }

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

/**
 * Route to remove content from a playlist
 *
 * @function
 * @name post/playlist/removeContent/:playlistId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Updated playlist without the removed content
 */
playlist.post('/playlist/removeContent/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { playlistId } = req.params;
    const { contentId } = req.body;

    if (!playlistId || !contentId) {
      return res.status(400).send('Invalid request body or parameters');
    }

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

/**
 * Route to delete a playlist by its ID
 *
 * @function
 * @name delete/playlist/:playlistId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Result of the delete operation
 */
playlist.delete('/playlist/:playlistId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { playlistId } = req.params;

    if (!playlistId) {
      return res.status(400).send('Invalid request parameters');
    }

    const playlist = await db.getPlaylistById(playlistId);
    if (!playlist) {
      return res.status(404).send('Playlist not found');
    }

    const isUserAssociated = await db.isUserAssociatedToPlaylist(user.uuid, playlistId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to delete this playlist');
    }

    const dbResult = await db.deletePlaylist(playlistId);
    return res.status(200).json(dbResult);
  } catch (error) {
    console.error('Error deleting playlist', error);
    return res.status(500).send('Could not delete playlist');
  }
});
