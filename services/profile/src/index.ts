import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import * as settings from './settings';
import { allowIfAnyOf } from './auth';

// Initialize Express app
const app: Express = express();

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for creating a new profile
app.post('/profiles', async (req: Request, res: Response) => {
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
      res.status(400).send('Organization with provided details already exists');
    } else {
      res.status(500).send('Error creating profile');
    }
  }
});

// Route for updating an existing profile by its ID
app.patch('/profiles/:profileId', async (req: Request, res: Response) => {
  const profileId = req.params.profileId as string;

  // Ensure at least one field is provided for update
  if (!(req.body.heroUrl || req.body.logoUrl || req.body.description || req.body.descriptionUrl || req.body.budget)) {
    return res.status(500).json('You must supply at least one field to update!');
  }

  // Store the values for each field to be updated
  const args = [
    req.body.heroUrl as string,
    req.body.logoUrl as string,
    req.body.description as string,
    req.body.descriptionUrl as string,
    req.body.budget as string
  ];

  // Update the profile and return the updated profile
  try {
    const dbResult = await db.updateProfile(profileId, ...args);
    res.status(200).json(dbResult);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Route for fetching a profile by its ID
app.get('/profiles/:profileId', async (req: Request, res: Response) => {
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
    res.status(404).send('Organization does not exist');
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
