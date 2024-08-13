import express, { Request, Response } from 'express';
import * as db from './db/queries/profile';
import { allowIfAnyOf, extractUser } from './middleware/auth';
import { getProfileData } from './utils/utils';

/**
 * Profile Service
 *
 * This service handles profile-related operations such as fetching, creating,
 * updating, and deleting profiles. It also manages building a collaborator object
 * for the front-end and allows fetching profiles by tag or a list of IDs.
 *
 *  * @module ProfileService
 */

export const profile = express.Router();

/**
 * Route to fetch all profiles
 *
 * @function
 * @name get/profiles
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} List of profiles
 */
profile.get('/profiles', allowIfAnyOf('anonymous', 'active'), async (_req: Request, res: Response) => {
  try {
    const r = await db.selectAllProfiles();
    res.status(200).json(r);
  } catch (e: any) {
    console.error('Error return all profiles', e);
    res.status(404).send('Error return all profiles');
  }
});

/**
 * Route to fetch all collaborators
 *
 * @function
 * @name get/collaborators
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} List of collaborators
 */
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

/**
 * Route to create a new profile
 *
 * @function
 * @name post/profiles
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} ID of the newly created profile
 */
profile.post('/profiles', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { organization, website, tag } = req.body;

  if (!organization || !website || !tag) {
    return res.status(401).send('Invalid Request Body: organization, website, and tag must be provided.');
  }

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

/**
 * Route to update an existing profile by its ID
 *
 * @function
 * @name patch/profiles/:profileId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Updated profile
 */
profile.patch('/profiles/:profileId', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const profileId = req.params.profileId as string;

  if (
    !(
      req.body.organization ||
      req.body.website ||
      req.body.heroFileId ||
      req.body.logoFileId ||
      req.body.description ||
      req.body.descriptionFileId ||
      req.body.budget ||
      req.body.status
    )
  ) {
    return res.status(500).json('You must supply at least one field to update!');
  }

  const user = extractUser(req);
  const isUserAssociated = await db.isUserAssociatedToProfile(user.uuid, profileId);
  if (!isUserAssociated) {
    return res.status(403).send('User does not have permission to update this profile');
  }

  const { organization, website, heroFileId, logoFileId, description, descriptionFileId, budget, status } = req.body;

  try {
    const dbResult = await db.updateProfile(
      profileId,
      organization as string,
      website as string,
      heroFileId as string,
      logoFileId as string,
      description as string,
      descriptionFileId as string,
      budget as string,
      status as string
    );
    res.status(200).json(dbResult);
  } catch (error) {
    console.error('Error updating profile', error);
    res.status(500).json(error);
  }
});

/**
 * Route to fetch a profile by its ID
 *
 * @function
 * @name get/profiles/:profileId
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Profile details
 */
profile.get('/profiles/:profileId', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { profileId } = req.params;

  if (!profileId) {
    res.status(404).send('Profile Id not provided.');
    return;
  }

  try {
    const profile = await getProfileData(profileId);
    res.status(200).json({ ...profile });
  } catch (e: any) {
    console.error('Profile does not exist', e);
    res.status(404).send('Profile does not exist');
  }
});

/**
 * Route to fetch a profile by its tag
 *
 * @function
 * @name get/profiles/tag/:tag
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} Profile details
 */
profile.get('/profiles/tag/:tag', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { tag } = req.params;

  if (!tag) {
    return res.status(404).send('Profile tag is not provided.');
  }

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

/**
 * Route to fetch a list of profiles by their IDs
 *
 * @function
 * @name post/getProfilesByIdList
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} List of profiles
 */
profile.post('/getProfilesByIdList', allowIfAnyOf('anonymous', 'active'), async (req: Request, res: Response) => {
  const { profileIdList } = req.body;

  if (!profileIdList) {
    res.status(404).send('Profile id list not provided.');
    return;
  }

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
