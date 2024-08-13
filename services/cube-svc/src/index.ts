import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import * as settings from './settings';
import * as contentQueries from './db/queries/content';
import * as profileQueries from './db/queries/profile';
import * as playlistQueries from './db/queries/playlist';

import { allowIfAnyOf, extractUser } from './middleware/auth';
import { deleteCloudflareData, getApiResultFromDbRow, transformContent, transformPlaylistSimple } from './utils/utils';

import { cloudflare } from './cloudflare';
import { profile } from './profile';
import { identity } from './identity';
import { content } from './content';
import { vtt } from './vtt';
import { playlist } from './playlist';

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/', cloudflare);
app.use('/', profile);
app.use('/', identity);
app.use('/', content);
app.use('/', vtt);
app.use('/', playlist);

/**
 * Main Application
 *
 * This module sets up the Express application, configures middleware,
 * and defines the main routes for the application.
 *
 * @module App
 */

/**
 * Search endpoint that allows searching across content, profiles, and playlists.
 *
 * @function
 * @name get/search
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Search results
 */
app.get('/search', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  type ServiceResult = {
    status: number | null;
    data: any | null;
    error: string | null;
    meta: any;
  };

  const scope: string | undefined = req.query.scope as string | undefined;
  const searchContentResult: ServiceResult = { status: null, data: null, error: null, meta: null };
  const searchProfileResult: ServiceResult = { status: null, data: null, error: null, meta: null };
  const searchPlaylistResult: ServiceResult = { status: null, data: null, error: null, meta: null };

  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const searchTerm = (req.query.searchTerm as string) || '';

  const filters: any = {};
  Object.keys(req.query).forEach((key) => {
    if (key.startsWith('filters.')) {
      const filterKey = key.substring('filters.'.length);
      filters[filterKey] = req.query[key];
      delete req.query[key];
    }
  });

  if (!scope || scope === 'content') {
    try {
      const contentSearchResult = await contentQueries.searchContent(offset, limit, filters, searchTerm);
      const data = contentSearchResult.map(getApiResultFromDbRow);

      searchContentResult.meta = {
        offset: offset,
        limit: limit,
        filters: filters
      };

      searchContentResult.status = 200;
      searchContentResult.data = await transformContent(data);
    } catch (error: any) {
      searchContentResult.status = error.response?.status || 500;
      searchContentResult.error = error.message;
    }
  }

  if (!scope || scope === 'profile') {
    try {
      const profileSearchResult = await profileQueries.searchProfiles(offset, limit, filters, searchTerm);

      searchProfileResult.meta = {
        offset: offset,
        limit: limit,
        filters: filters
      };

      searchProfileResult.status = 200;
      searchProfileResult.data = profileSearchResult;
    } catch (error: any) {
      searchProfileResult.status = error.response?.status || 500;
      searchProfileResult.error = error.message;
    }
  }

  if (!scope || scope === 'playlist') {
    try {
      const playlistSearchResult = await playlistQueries.searchPlaylist(offset, limit, filters, searchTerm);
      const playlistData = playlistSearchResult.map(getApiResultFromDbRow);

      searchPlaylistResult.meta = {
        offset: offset,
        limit: limit,
        filters: filters
      };

      searchPlaylistResult.status = 200;
      searchPlaylistResult.data = await transformPlaylistSimple(playlistData);
    } catch (error: any) {
      searchPlaylistResult.status = error.response?.status || 500;
      searchPlaylistResult.error = error.message;
    }
  }

  const responsePayload: any = {};

  if (!scope || scope === 'content') {
    responsePayload.contentResults = {
      meta: searchContentResult.meta,
      data: searchContentResult.data,
      status: searchContentResult.status,
      error: searchContentResult.error
    };
  }

  if (!scope || scope === 'profile') {
    responsePayload.profileResults = {
      meta: searchProfileResult.meta,
      data: searchProfileResult.data,
      status: searchProfileResult.status,
      error: searchProfileResult.error
    };
  }

  if (!scope || scope === 'playlist') {
    responsePayload.playlistResults = {
      meta: searchPlaylistResult.meta,
      data: searchPlaylistResult.data,
      status: searchPlaylistResult.status,
      error: searchPlaylistResult.error
    };
  }

  return res.status(200).json(responsePayload);
});

/**
 * Deactivate a profile.
 *
 * @function
 * @name post/deactivateProfile
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {String} Status message
 */
app.post('/deactivateProfile', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const user = extractUser(req);
  const { profileId } = req.body;

  if (!profileId) {
    return res.status(400).send('Profile ID not provided');
  }

  const profile = await profileQueries.selectProfileByID(profileId);

  if (profile) {
    //@ts-ignore
    const isUserAssociated = await profileQueries.isUserAssociatedToProfile(user.uuid, profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to deactivate this profile');
    }

    try {
      await profileQueries.updateProfile(
        profileId,
        profile.organization,
        profile.website,
        profile.herofileid,
        profile.logofileid,
        profile.description,
        profile.descriptionfileid,
        profile.budget,
        'inactive'
      );

      const profileContent = await contentQueries.listContentByProfileId(0, 1000, {}, profileId);
      for (const contentItem of profileContent) {
        await contentQueries.deleteContent(contentItem.id!);
        //@ts-ignore
        await deleteCloudflareData(contentItem.data.mediaFileId);
        //@ts-ignore
        await deleteCloudflareData(contentItem.data.coverImageFileId);
      }
      return res.status(200).send('Profile deactivated');
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  }
});

/**
 * Health check endpoint to verify the service is running.
 *
 * @function
 * @name get/
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {String} Service status message
 */
app.get('/', async (_req: Request, res: Response) => {
  return res.status(200).send('Service is running');
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
