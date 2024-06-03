import express, { Request, Response } from 'express';

// const { PubSub } = require('@google-cloud/pubsub');
// const pubsub = new PubSub();

import * as db from './db/queries/content';
import * as dbCloudflare from './db/queries/cloudflare';
import { allowIfAnyOf, extractUser } from './middleware/auth';
import { sendReportAbuseEmail } from './middleware/email';
import { getApiResultFromDbRow, deleteCloudflareData, hashString, encryptString, decryptString, comparePassword } from './utils/utils';

import { transformContent } from './utils/utils';
export const content = express.Router();

// API endpoint for creating new content
content.post('/content', async (req: Request, res: Response) => {
  try {
    // const user = extractUser(req);
    const { profileId, vttFileId, password, ...contentData } = req.body;

    // Validate request body
    if (!profileId || Object.keys(contentData).length === 0) {
      return res.status(400).send('Invalid request body');
    }

    //Check that the user creating content is indeed associated to the profile submitted in the request
    // const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
    // if (!isUserAssociated) {
    //   return res.status(403).send('User does not have permission to create content for this profile');
    // }

    if (vttFileId) {
      contentData.vttFileId = vttFileId;
    }

    let dataToStore = { profileId, ...contentData };
    let encryptedPassword = null;

    if (password) {
      dataToStore = encryptString(JSON.stringify(dataToStore));

      const hashedPassword = await hashString(password);
      encryptedPassword = encryptString(hashedPassword);
    }

    // Insert content into database
    const r = await db.insertContent(encryptedPassword, dataToStore);
    const dbResult = r?.dataValues;

    return res.status(201).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error creating the content item', error);
    return res.status(500).send('Error creating the content item');
  }
});

// API endpoint for listing content by profile id with ability to filter by
// data points such as type or tags
content.get('/content', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const profileId = req.query.profileId as string;
  const filters = req.query.filters ?? {};

  const dbResult = await db.listContentByProfileId(offset, limit, filters, profileId);

  const data = dbResult.map(getApiResultFromDbRow);
  const transformedContent = await transformContent(data);

  // Returning paginated content data
  res.status(200).json(transformedContent);
});

// API endpoint for getting content by content id
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

// API endpoint for updating content by content id
content.post('/content/:contentId', async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { profileId, password, ...contentData } = req.body;
    const { contentId } = req.params;

    // Validate request body and parameters
    if (!profileId || Object.keys(contentData).length === 0 || !contentId) {
      return res.status(400).send('Invalid request body or parameters');
    }

    // Check that the user updating content is indeed associated to the profile submitted in the request
    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to update content for this profile');
    }

    const r = await db.getContentById(contentId);
    if (!r) {
      return res.status(404).send('Content not found');
    }

    let dataToStore = { profileId, ...contentData };

    const contentItem = r.dataValues;
    if (contentItem.password) {
      const decryptedPassword = decryptString(contentItem.password);
      const isValidPassword = !password ? false : await comparePassword(password, decryptedPassword);
      if (!isValidPassword) {
        return res.status(403).send('Invalid password');
      }

      dataToStore = encryptString(JSON.stringify(dataToStore), password);
    }

    // Update content in the database
    const dbResult = await db.updateContent(contentItem.password ?? null, dataToStore, contentId);

    return res.status(200).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error updating the content item', error);
    return res.status(500).send('Error updating the content item');
  }
});

// API endpoint for deleting content by content id
content.delete('/content/:contentId', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { contentId } = req.params;

    // Validate request parameters
    if (!contentId) {
      return res.status(400).send('Invalid request parameters');
    }

    // Retrieve content item to delete
    const contentItem = await db.getContentById(contentId);
    if (!contentItem) {
      return res.status(404).send('Content not found');
    }

    // Check if user is associated with the profile of the content item
    //@ts-ignore
    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, contentItem.data.profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to delete content for this profile');
    }

    // Delete content and file record in the database
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

// API endpoint for reporting a content item
content.post('/report', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { disputedUrl, requestType, contactName, contactEmail, issueDesc, ticketId } = req.body;

  // Check if any of the parameters are missing or falsy
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
