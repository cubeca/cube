import express, { Express, Request, Response } from 'express';
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

import cors from 'cors';
import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { sendReportAbuseEmail } from './email';

// Creating an instance of Express application
const app: Express = express();
app.use(cors());
app.use(express.json());

// Utility function to map database result to API result
const getApiResultFromDbRow = (r: any) => ({
  id: r.id,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  ...r.data
});

// API endpoint for creating new content
app.post('/content', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { profileId, vttFileId, ...contentData } = req.body;
    const { type } = contentData;
    // Validate request body
    if (!profileId || Object.keys(contentData).length === 0) {
      return res.status(400).send('Invalid request body');
    }

    // Check that the user creating content is indeed associated to the profile submitted in the request
    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to create content for this profile');
    }

    // Insert content into database
    const dbResult = await db.insertContent({ profileId, ...contentData });
    const response = { ...dbResult };
    if (!vttFileId && (type === 'video' || type === 'audio')) {
      // Publish a message to Google Pub/Sub
      const topicName = 'vtt_transcribe'; // Replace with your actual topic name
      const message = JSON.stringify({ contentID: dbResult.id.toString(), tries: 0 }); // Assuming dbResult.id is the ID you want to publish
      await pubsub.topic(topicName).publish(Buffer.from(message));
      console.log('Queued VTT');
      response.data.vttQueued = true;
    }

    return res.status(201).json(getApiResultFromDbRow(response));
  } catch (error) {
    console.error('Error creating the content item', error);
    res.status(500).send('Error creating the content item');
  }
});

// API endpoint for listing content by profile id with ability to filter by
// data points such as type or tags
app.get('/content', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const profileId = req.query.profileId as string;
  const filters = req.query.filters ?? {};

  const dbResult = await db.listContentByProfileId(offset, limit, filters, profileId);

  // Returning paginated content data
  res.status(200).json({
    meta: {
      offset,
      limit,
      filters
    },
    data: dbResult.map(getApiResultFromDbRow)
  });
});

// API endpoint for getting content by content id
app.get('/content/:contentId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  res.status(200).json(getApiResultFromDbRow(await db.getContentById(req.params.contentId)));
});

// API endpoint for updating content by content id
app.post('/content/:contentId', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const user = extractUser(req);
    const { profileId, ...contentData } = req.body;
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

    // Update content in the database
    const dbResult = await db.updateContent({ profileId, ...contentData }, contentId);

    return res.status(200).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error updating the content item', error);
    res.status(500).send('Error updating the content item');
  }
});

// API endpoint for deleting content by content id
app.delete('/content/:contentId', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
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
    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, contentItem.data.profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to delete content for this profile');
    }

    // Delete content in the database
    const dbResult = await db.deleteContent(contentId);
    return res.status(200).json(getApiResultFromDbRow(dbResult));
  } catch (error) {
    console.error('Error deleting content item', error);
    res.status(500).send('Could not delete content item');
  }
});

app.get('/search', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const searchTerm = (req.query.searchTerm as string) || '';
  const filters = req.query.filters ?? {};

  //  Check if the search term is provided
  if (!searchTerm && !filters) {
    return res.status(404).send('Search term or a filter is not provided.');
  }

  try {
    const searchResult = await db.searchContent(offset, limit, filters, searchTerm);
    res.status(200).json({
      meta: {
        offset,
        limit,
        filters
      },
      data: searchResult
    });
  } catch (error) {
    console.error('Error searching for content', error);
    res.status(500).send('Error searching for content');
  }
});

// API endpoint for reporting a content item
app.post('/report', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { disputedUrl, requestType, contactName, contactEmail, issueDesc } = req.body;

  // Check if any of the parameters are missing or falsy
  if (!disputedUrl || !requestType || !contactName || !contactEmail || !issueDesc) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    await sendReportAbuseEmail(disputedUrl, requestType, contactName, contactEmail, issueDesc);
    res.status(200).json('OK');
  } catch (error) {
    console.error('Error sending content report', error);
    res.status(500).send('Error sending content report');
  }
});

// API endpoint for checking the service status
app.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send('Service is running');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.get('/vtt/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.getVTTById(id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting VTT', error);
    res.status(500).send('Error getting VTT');
  }
});

app.put('/vtt/:id', allowIfAnyOf('contentEditor'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;
    console.log({ id, transcript });
    const user = extractUser(req);
    console.log({ user });
    const content = await db.getContentById(id);
    const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, content.data.profileId);
    if (!isUserAssociated) {
      return res.status(403).send('User does not have permission to update content for this profile');
    }
    const result = await db.updateVTT(id, transcript);
    const dataBuffer = Buffer.from(id);
    await pubsub.topic('vtt_upload').publishMessage({ data: dataBuffer });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating VTT', error);
    res.status(500).send('Error updating VTT');
  }
});

// Starting the server
app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
