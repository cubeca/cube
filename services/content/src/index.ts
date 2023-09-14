import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';

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
    const { profileId, ...contentData } = req.body;

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
    return res.status(201).json(getApiResultFromDbRow(dbResult));
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
  const filters = JSON.parse((req.query.filters as string) ?? '{}');

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

app.get('/search', async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const searchTerm = (req.query.searchTerm as string) || '';
  const filters = JSON.parse((req.query.filters as string) ?? '{}');

  // Check if the search term is provided
  if (!searchTerm) {
    return res.status(404).send('Search term not provided.');
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

// API endpoint for checking the service status
app.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send('Service is running');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Starting the server
app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
