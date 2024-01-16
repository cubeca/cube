import { Profile } from './models';
import { User } from './models';
import { Op } from 'sequelize';

// Function to insert a new profile into the 'profiles' table
export const insertProfile = async (organization: string, website: string, tag: string) => {
  return await Profile.create({
    organization,
    website,
    tag
  });
};

// Function to select a profile from the 'profiles' table by its ID
export const selectProfileByID = async (id: string) => {
  return await Profile.findOne({
    where: {
      id: id
    }
  });
};

// Function to select a profile from the 'profiles' table by its ID
export const selectProfilesByIdList = async (idList: any) => {
  return await Profile.findAll({
    where: {
      id: idList
    }
  });
};

// Function to select all of the profiles from the 'profiles' table
export const selectAllProfiles = async () => {
  return await Profile.findAll({
    attributes: ['id', 'organization', 'tag']
  });
};

// Function to select a profile from the 'profiles' table by its tag
export const selectProfileByTag = async (tag: string) => {
  return await Profile.findOne({
    where: {
      tag: tag.toLowerCase()
    }
  });
};

// Function to delete a profile from the 'profiles' table by its ID
export const deleteProfile = async (profileId: string) => {
  return await Profile.destroy({
    where: {
      id: profileId
    },
    returning: true
  });
};

// Function to update a profile in the 'profiles' table by its ID and given arguments
export const updateProfile = async (
  profileId: string,
  organization: string,
  website: string,
  heroFileId: string,
  logoFileId: string,
  description: string,
  descriptionFileId: string,
  budget: string
) => {
  const updatedProfile = await Profile.update(
    {
      organization,
      website,
      heroFileId,
      logoFileId,
      description,
      descriptionFileId,
      budget
    },
    {
      where: {
        id: profileId
      },
      returning: true
    }
  );

  return updatedProfile[1][0];
};

export const isUserAssociatedToProfile = async (uuid: string, profileId: string) => {
  const exists = await User.findOne({
    where: {
      id: uuid,
      profile_id: profileId
    }
  });

  return !!exists;
};

export const searchProfiles = async (offset: number, limit: number, searchTerm: string) => {
  const searchTerms = searchTerm
    .split('&')
    .map((term) => term.trim())
    .filter((term) => term);

  const whereClauses = searchTerms.map((term) => ({
    [Op.or]: [
      { organization: { [Op.iLike]: `%${term}%` } },
      { website: { [Op.iLike]: `%${term}%` } },
      { tag: { [Op.iLike]: `%${term}%` } },
      { description: { [Op.iLike]: `%${term}%` } }
    ]
  }));

  const options = {
    where: {
      [Op.and]: whereClauses
    },
    order: [['organization', 'ASC']],
    limit,
    offset
  };

  const result = await Profile.findAll(options);
  return result;
};
