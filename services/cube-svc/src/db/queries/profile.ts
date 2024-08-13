import { Profile, User } from '../models';
import { Op, OrderItem, Sequelize } from 'sequelize';

/**
 * Insert a new profile into the database.
 *
 * @function
 * @name insertProfile
 * @param {string} organization - The organization name.
 * @param {string} website - The website URL.
 * @param {string} tag - The tag associated with the profile.
 * @returns {Promise<Profile>} The inserted profile object.
 * @throws {Error} If the insertion fails.
 */
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
      budget: '',
      status: 'active'
    });

    return profile;
  } catch (error) {
    throw new Error('Failed to insert profile');
  }
};

/**
 * Select a profile by its ID.
 *
 * @function
 * @name selectProfileByID
 * @param {string} id - The ID of the profile to retrieve.
 * @returns {Promise<Profile|null>} The profile object, or null if not found.
 */
export const selectProfileByID = async (id: string) => {
  return await Profile.findOne({
    where: {
      id: id
    }
  });
};

/**
 * Select profiles by a list of IDs.
 *
 * @function
 * @name selectProfilesByIdList
 * @param {string[]} idList - The list of profile IDs to retrieve.
 * @returns {Promise<Profile[]>} The list of profile objects.
 */
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

/**
 * Select all profiles.
 *
 * @function
 * @name selectAllProfiles
 * @returns {Promise<Profile[]>} The list of all profile objects.
 */
export const selectAllProfiles = async () => {
  return await Profile.findAll({
    attributes: ['id', 'organization', 'tag']
  });
};

/**
 * Select a profile by its tag.
 *
 * @function
 * @name selectProfileByTag
 * @param {string} tag - The tag of the profile to retrieve.
 * @returns {Promise<Profile|null>} The profile object, or null if not found.
 */
export const selectProfileByTag = async (tag: string) => {
  return await Profile.findOne({
    where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('tag')), Sequelize.fn('LOWER', tag))
  });
};

/**
 * Update a profile by its ID.
 *
 * @function
 * @name updateProfile
 * @param {string} profileId - The ID of the profile to update.
 * @param {string} organization - The updated organization name.
 * @param {string} website - The updated website URL.
 * @param {string} heroFileId - The updated hero file ID.
 * @param {string} logoFileId - The updated logo file ID.
 * @param {string} description - The updated description.
 * @param {string} descriptionFileId - The updated description file ID.
 * @param {string} budget - The updated budget.
 * @param {string} status - The updated status.
 * @returns {Promise<Profile>} The updated profile object.
 */
export const updateProfile = async (
  profileId: string,
  organization: string,
  website: string,
  heroFileId: string,
  logoFileId: string,
  description: string,
  descriptionFileId: string,
  budget: string,
  status: string
) => {
  const updatedProfile = await Profile.update(
    {
      organization,
      website,
      herofileid: heroFileId,
      logofileid: logoFileId,
      description,
      descriptionfileid: descriptionFileId,
      budget,
      status
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

/**
 * Check if a user is associated with a profile.
 *
 * @function
 * @name isUserAssociatedToProfile
 * @param {string} uuid - The UUID of the user.
 * @param {string} profileId - The ID of the profile.
 * @returns {Promise<boolean>} True if the user is associated with the profile, false otherwise.
 */
export const isUserAssociatedToProfile = async (uuid: string, profileId: string) => {
  const exists = await User.findOne({
    where: {
      id: uuid,
      profile_id: profileId
    }
  });

  return !!exists;
};

/**
 * Search profiles based on filters and a search term with pagination.
 *
 * @function
 * @name searchProfiles
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The limit for pagination.
 * @param {Object} filters - The filters to apply to the search.
 * @param {string} searchTerm - The search term to use.
 * @returns {Promise<Profile[]>} The list of profiles that match the search criteria.
 */
export const searchProfiles = async (offset: number, limit: number, filters: any, searchTerm: string) => {
  let whereClauses: any = {};

  const searchTerms = searchTerm
    .split('&')
    .map((term) => term.trim())
    .filter((term) => term);

  whereClauses = searchTerms.map((term) => ({
    [Op.or]: [
      { organization: { [Op.iLike]: `%${term}%` } },
      { website: { [Op.iLike]: `%${term}%` } },
      { tag: { [Op.iLike]: `%${term}%` } },
      { description: { [Op.iLike]: `%${term}%` } }
    ]
  }));

  if (filters.status) {
    whereClauses[Op.and] = whereClauses[Op.and] || [];
    whereClauses[Op.and].push({
      status: {
        [Op.iLike]: `%${filters.status}%`
      }
    });
  }

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
