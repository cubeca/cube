import express, { Request, Response } from 'express';

import * as db from './db/queries/profile';
import * as contentQueries from './db/queries/content';

import { allowIfAnyOf, extractUser } from './middleware/auth';
import { getProfileData } from './utils/utils';

export const profile = express.Router();
profile.get('/profiles', allowIfAnyOf('anonymous', 'active'), async (_req: Request, res: Response) => {
  try {
    const r = await db.selectAllProfiles();
    res.status(200).json(r);
  } catch (e: any) {
    console.error('Error return all profiles', e);
    res.status(404).send('Error return all profiles');
  }
});

profile.get('/collaborators', allowIfAnyOf('anonymous', 'active'), async (_req: Request, res: Response) => {
  try {
    const r = await db.selectAllProfiles();
    const result = Object.values(r).map((item: any) => ({
      id: item.id,
      organization: item.organization,
      tag: item.tag
    }));

    res.status(200).json(result);
  } catch (e: any) {
    console.error('Error return all profiles', e);
    res.status(404).send('Error return all profiles');
  }
});

// Route for creating a new profile
profile.post('/profiles', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { organization, website, tag } = req.body;

  // Check if required fields are provided in the request body
  if (!organization || !website || !tag) {
    return res.status(401).send('Invalid Request Body: organization, website, and tag must be provided.');
  }

  // Insert the new profile and return its ID
  try {
    const r = await db.insertProfile(organization, website, tag);
    res.status(201).json({ id: r.id });
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
profile.patch('/profiles/:profileId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
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
  const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
  if (!isUserAssociated) {
    return res.status(403).send('User does not have permission to update this profile');
  }

  // Store the values for each field to be updated
  const { organization, website, heroFileId, logoFileId, description, descriptionFileId, budget } = req.body;

  // Update the profile and return the updated profile
  try {
    const dbResult = await db.updateProfile(
      profileId,
      organization as string,
      website as string,
      heroFileId as string,
      logoFileId as string,
      description as string,
      descriptionFileId as string,
      budget as string
    );
    res.status(200).json(dbResult);
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json(error);
  }
});

// Route for fetching a profile by its ID
profile.get('/profiles/:profileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { profileId } = req.params;

  // Check if the profile ID is provided
  if (!profileId) {
    res.status(404).send('Profile Id not provided.');
    return;
  }

  // Fetch the profile and return its details
  try {
    const profile = await getProfileData(profileId);
    res.status(200).json({ ...profile });
  } catch (e: any) {
    console.error('Profile does not exist', e);
    res.status(404).send('Profile does not exist');
  }
});

// Route for fetching a profile by its tag
profile.get('/profiles/tag/:tag', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { tag } = req.params;

  // Check if the profile ID is provided
  if (!tag) {
    return res.status(404).send('Profile tag is not provided.');
  }

  // Fetch the profile and return its details
  try {
    const r = await db.selectProfileByTag(tag);

    if (!r) {
      return res.status(404).send('Profile tag not found');
    }

    const profileId = r.dataValues.id;
    const profile = await getProfileData(profileId ?? '');
    res.status(200).json({ data: profile });
  } catch (e: any) {
    console.error('Profile does not exists', e);
    res.status(404).send('Profile does not exist');
  }
});

// Route for fetching a list of profile by their ids
profile.post('/getProfilesByIdList', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { profileIdList } = req.body;

  // Check if the profile id list is provided
  if (!profileIdList) {
    res.status(404).send('Profile id list not provided.');
    return;
  }

  // Fetch the profile and return its details
  try {
    const r = await db.selectProfilesByIdList(profileIdList);

    if (!r) {
      res.status(404).send('No profiles found');
      return;
    }

    res.status(200).json(r);
  } catch (e: any) {
    console.error('Error retrieving profile list', e);
    res.status(404).send('Error retrieving profile list');
  }
});

// Route for deleting a profile by its ID
profile.delete('/profiles/:profileId', allowIfAnyOf('active', 'userAdmin'), async (req: Request, res: Response) => {
  const profileId = req.params.profileId;

  if (!profileId) {
    return res.status(400).send('Profile ID is not provided.');
  }

  const user = extractUser(req);
  const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
  if (!isUserAssociated) {
    return res.status(403).send('User does not have permission to modify this profile');
  }

  const contentList = await contentQueries.listContentByProfileId(0, 100000, {}, profileId);
  if (contentList && contentList.length > 0) {
    const contentIds = contentList.map((content) => content.id!);
    await contentQueries.deleteContentByIdList(contentIds);
  }

  await db.deleteProfile(profileId);
  res.status(200).send('Profile de-activated successfully');
});
