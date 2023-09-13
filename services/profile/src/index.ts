import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { isUserAssociatedToProfile } from './db/queries';

// Initialize Express app
const app: Express = express();

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/profiles', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  try {
    const r = await db.selectAllProfiles();
    res.status(200).json(r.rows);
  } catch (e: any) {
    console.error('Error return all profiles', e);
    res.status(404).send('Error return all profiles');
  }
});

// Route for creating a new profile
app.post('/profiles', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { organization, website, tag } = req.body;

  // Check if required fields are provided in the request body
  if (!organization || !website || !tag) {
    return res.status(401).send('Invalid Request Body: organization, website, and tag must be provided.');
  }

  // Insert the new profile and return its ID
  try {
    const r = await db.insertProfile(organization, website, tag);
    const profile = r.rows[0];
    res.status(201).json({ id: profile.id });
  } catch (e: any) {
    if (e.message.indexOf('duplicate key') !== -1) {
      console.error('Organization with provided details already exists', e);
      res.status(400).send('Organization with provided details already exists');
    } else {
      console.error('Error creating profile', e);
      res.status(500).send('Error creating profile');
    }
  }
});

// Route for updating an existing profile by its ID
app.patch('/profiles/:profileId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const profileId = req.params.profileId as string;

  // Ensure at least one field is provided for update
  if (
    !(
      req.body.organization ||
      req.body.website ||
      req.body.heroFileId ||
      req.body.logoFileId ||
      req.body.description ||
      req.body.descriptionFileId ||
      req.body.budget
    )
  ) {
    return res.status(500).json('You must supply at least one field to update!');
  }

  const user = extractUser(req);
  const isUserAssociated = await isUserAssociatedToProfile(user.uuid, profileId);
  if (!isUserAssociated) {
    return res.status(403).send('User does not have permission to update this profile');
  }

  // Store the values for each field to be updated
  const args = [
    req.body.organization as string,
    req.body.website as string,
    req.body.heroFileId as string,
    req.body.logoFileId as string,
    req.body.description as string,
    req.body.descriptionFileId as string,
    req.body.budget as string
  ];

  // Update the profile and return the updated profile
  try {
    const dbResult = await db.updateProfile(profileId, ...args);
    res.status(200).json(dbResult.rows[0]);
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json(error);
  }
});

// Route for fetching a profile by its ID
app.get('/profiles/:profileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { profileId } = req.params;

  // Check if the profile ID is provided
  if (!profileId) {
    res.status(404).send('Profile Id not provided.');
    return;
  }

  // Fetch the profile and return its details
  try {
    const r = await db.selectProfileByID(profileId);
    const profile = r.rows[0];

    if (!profile) {
      res.status(404).send('Profile Id not found');
      return;
    }

    res.status(200).json({ ...profile });
  } catch (e: any) {
    console.error('Profile does not exist', e);
    res.status(404).send('Profile does not exist');
  }
});

// Route for fetching a profile by its tag
app.get('/profiles/tag/:tag', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { tag } = req.params;

  // Check if the profile ID is provided
  if (!tag) {
    return res.status(404).send('Profile tag is not provided.');
  }

  // Fetch the profile and return its details
  try {
    const r = await db.selectProfileByTag(tag);
    const profile = r.rows[0];

    if (!profile) {
      return res.status(404).send('Profile tag not found');
    }

    res.status(200).json({ ...profile });
  } catch (e: any) {
    console.error('Profile does not exists', e);
    res.status(404).send('Profile does not exist');
  }
});

// Route for fetching a list of profile by their ids
app.post('/getProfilesByIdList', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { profileIdList } = req.body;

  // Check if the profile id list is provided
  if (!profileIdList) {
    res.status(404).send('Profile id list not provided.');
    return;
  }

  // Fetch the profile and return its details
  try {
    const r = await db.selectProfilesByIdList(profileIdList);
    const profiles = r.rows;

    if (!profiles) {
      res.status(404).send('No profiles found');
      return;
    }

    res.status(200).json({ ...profiles });
  } catch (e: any) {
    console.error('Error retrieving profile list', e);
    res.status(404).send('Error retrieving profile list');
  }
});

app.get('/search', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const searchTerm = req.query.searchTerm as string;
  const filters = JSON.parse((req.query.filters as string) ?? '{}');

  // Check if the search term is provided
  if (!searchTerm) {
    return res.status(404).send('Search term not provided.');
  }

  // Fetch the profile and return its details
  try {
    const r = await db.searchProfiles(searchTerm);
    const profiles = r.rows;

    if (!profiles) {
      return res.status(404).send('No profiles found');
    }

    res.status(200).json({ ...profiles });
  } catch (e: any) {
    console.error('Error retrieving profile search results', e);
    res.status(404).send('Error retrieving profile search results');
  }
});

// Route for deleting a profile by its ID
app.delete('/profiles/:profileId', allowIfAnyOf('userAdmin'), async (req: Request, res: Response) => {
  const r = await db.deleteProfile(req.params.profileId);
  res.status(200).json({ ...r });
});

// Route for checking if the service is running
app.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).send('Service is running');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
