import { Profile, User } from '../models';
import { Op, OrderItem, Sequelize } from 'sequelize';

export const insertProfile = async (organization: string, website: string, tag: string) => {
  try {
    const profile = await Profile.create({
      organization,
      website,
      tag,
      herofileid: '',
      logofileid: '',
      description: '',
      descriptionfileid: '',
      budget: ''
    });

    return profile;
  } catch (error) {
    throw new Error('Failed to insert profile');
  }
};

export const selectProfileByID = async (id: string) => {
  return await Profile.findOne({
    where: {
      id: id
    }
  });
};

export const selectProfilesByIdList = async (idList: string[]) => {
  const r = await Profile.findAll({
    where: {
      id: {
        [Op.in]: idList
      }
    }
  });

  return r;
};

export const selectAllProfiles = async () => {
  return await Profile.findAll({
    attributes: ['id', 'organization', 'tag']
  });
};

export const selectProfileByTag = async (tag: string) => {
  return await Profile.findOne({
    where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('tag')), Sequelize.fn('LOWER', tag))
  });
};

export const deleteProfile = async (profileId: string) => {
  return await Profile.destroy({
    where: {
      id: profileId
    }
  });
};

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
      herofileid: heroFileId,
      logofileid: logoFileId,
      description,
      descriptionfileid: descriptionFileId,
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
      [Op.or]: whereClauses
    },
    order: [['organization', 'ASC']] as OrderItem[],
    limit,
    offset
  };

  const result: Profile[] = await Profile.findAll(options);
  return result;
};
