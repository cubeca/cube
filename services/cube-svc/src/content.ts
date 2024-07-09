import express, { Request, Response } from 'express';

// const { PubSub } = require('@google-cloud/pubsub');
// const pubsub = new PubSub();

import * as db from './db/queries/content';
import * as dbCloudflare from './db/queries/cloudflare';
import { allowIfAnyOf, extractUser } from './middleware/auth';
import { sendReportAbuseEmail } from './middleware/email';
import { getApiResultFromDbRow, deleteCloudflareData } from './utils/utils';
import { transformContent } from './utils/utils';

export const content = express.Router();

/**
 * Content Service
 *
 * This service handles operations related to content, such as creating, fetching,
 * updating, deleting content items, and reporting abuse.  This service is also responsible
 * for translating database rows into consumable objects for the front-end.
 *
 * @module ContentService
 */

/**
 * Create a new content item.
 *
 * @function
 * @name post/content
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Newly created content item
 */
content.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { profileId, vttFileId, ...contentData } = req.body;

    if (!profileId || Object.keys(contentData).length === 0) {
      return res.status(400).send('Invalid request body');
    }

    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to create content for this profile');
    }

    if (vttFileId) {
      contentData.vttFileId = vttFileId;
    }

    const r = await db.insertContent({ profileId, ...contentData });
    const dbResult = r?.dataValues;

    return res.status(201).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error creating the content item', error);
    return res.status(500).send('Error creating the content item');
  }
});

/**
 * List content items by profile ID with ability to filter by data points such as type or tags.
 *
 * @function
 * @name get/content
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} List of content items
 */
content.get('/content', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const profileId = req.query.profileId as string;
  const filters = req.query.filters ?? {};

  const dbResult = await db.listContentByProfileId(offset, limit, filters, profileId);
  const data = dbResult.map(getApiResultFromDbRow);
  const transformedContent = await transformContent(data);

  res.status(200).json(transformedContent);
});

/**
 * Fetch a content item by its ID.
 *
 * @function
 * @name get/content/:contentId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Content item details
 */
content.get('/content/:contentId', async (req: Request, res: Response) => {
  const contentId = req.params.contentId;
  if (!contentId) {
    return res.status(400).send('Invalid content ID');
  }

  const dbResult = await db.getContentById(contentId);
  if (!dbResult) {
    return res.status(404).send('Content not found');
  }

  const content = getApiResultFromDbRow(dbResult);
  const transformedContent = await transformContent([content]);

  return res.status(200).json(transformedContent[0]);
});

/**
 * Update a content item by its ID.
 *
 * @function
 * @name post/content/:contentId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Updated content item
 */
content.post('/content/:contentId', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { profileId, ...contentData } = req.body;
    const { contentId } = req.params;

    if (!profileId || Object.keys(contentData).length === 0 || !contentId) {
      return res.status(400).send('Invalid request body or parameters');
    }

    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to update content for this profile');
    }

    const dbResult = await db.updateContent({ profileId, ...contentData }, contentId);

    return res.status(200).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error updating the content item', error);
    return res.status(500).send('Error updating the content item');
  }
});

/**
 * Delete a content item by its ID.
 *
 * @function
 * @name delete/content/:contentId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Result of the delete operation
 */
content.delete('/content/:contentId', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { contentId } = req.params;

    if (!contentId) {
      return res.status(400).send('Invalid request parameters');
    }

    const contentItem = await db.getContentById(contentId);
    if (!contentItem) {
      return res.status(404).send('Content not found');
    }

    //@ts-ignore
    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, contentItem.data.profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to delete content for this profile');
    }

    const deleteContentResult = await db.deleteContent(contentId);

    //@ts-ignore
    await deleteCloudflareData(contentItem.data.mediaFileId);

    //@ts-ignore
    await deleteCloudflareData(contentItem.data.coverImageFileId);

    //@ts-ignore
    await dbCloudflare.deleteFileById(contentItem.data.mediaFileId as string);
    return res.status(200).json(getApiResultFromDbRow(deleteContentResult));
  } catch (error) {
    console.error('Error deleting content item', error);
    return res.status(500).send('Could not delete content item');
  }
});

/**
 * Report a content item.
 *
 * @function
 * @name post/report
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {String} Status message
 */
content.post('/report', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { disputedUrl, requestType, contactName, contactEmail, issueDesc, ticketId } = req.body;

  if (!disputedUrl || !requestType || !contactName || !contactEmail || !issueDesc || !ticketId) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    await sendReportAbuseEmail(disputedUrl, requestType, contactName, contactEmail, issueDesc, ticketId);
    return res.status(200).json('OK');
  } catch (error) {
    console.error('Error sending content report', error);
    return res.status(500).send('Error sending content report');
  }
});
