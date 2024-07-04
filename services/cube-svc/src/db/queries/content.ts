import { Content, Vtt, User } from '../models';
import { Op } from 'sequelize';

/**
 * Get content by its ID.
 *
 * @function
 * @name getContentById
 * @param {string} contentId - The ID of the content to retrieve.
 * @returns {Promise<Content|null>} The content object, or null if not found.
 */
export const getContentById = async (contentId: string) => {
  return await Content.findOne({ where: { id: contentId } });
};

/**
 * Get a list of content by their IDs.
 *
 * @function
 * @name getContentByIdList
 * @param {string[]} contentIdList - The list of content IDs to retrieve.
 * @returns {Promise<Content[]>} The list of content objects.
 */
export const getContentByIdList = async (contentIdList: string[]) => {
  return await Content.findAll({ where: { id: contentIdList } });
};

/**
 * Insert new content into the database.
 *
 * @function
 * @name insertContent
 * @param {Object} data - The data of the content to insert.
 * @returns {Promise<Content>} The inserted content object.
 */
export const insertContent = async (data: any) => {
  return await Content.create({ data });
};

/**
 * Update existing content in the database.
 *
 * @function
 * @name updateContent
 * @param {Object} data - The updated data of the content.
 * @param {string} contentId - The ID of the content to update.
 * @returns {Promise<Content>} The updated content object.
 */
export const updateContent = async (data: any, contentId: string) => {
  const updatedContent = await Content.update({ data }, { where: { id: contentId }, returning: true });
  return updatedContent[1][0];
};

/**
 * Delete content by its ID.
 *
 * @function
 * @name deleteContent
 * @param {string} contentId - The ID of the content to delete.
 * @returns {Promise<void>} A promise that resolves when the content is deleted.
 * @throws {Error} If the content is not found.
 */
export const deleteContent = async (contentId: string) => {
  const content = await Content.findOne({ where: { id: contentId } });
  if (!content) {
    throw new Error('Content not found');
  }

  return await content.destroy();
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
  const user = await User.findOne({ where: { id: uuid, profile_id: profileId } });
  return !!user;
};

/**
 * Search content based on filters and a search term.
 *
 * @function
 * @name searchContent
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The limit for pagination.
 * @param {Object} filters - The filters to apply to the search.
 * @param {string} searchTerm - The search term to use.
 * @returns {Promise<Content[]>} The list of content objects that match the search criteria.
 */
export const searchContent = async (offset: number, limit: number, filters: any, searchTerm: string) => {
  let whereClause: any = {};

  if (searchTerm.trim() !== '') {
    const searchTerms = searchTerm
      .split('&')
      .map((term) => term.trim())
      .filter((term) => term);

    whereClause[Op.and] = searchTerms.map((term: string) => ({
      data: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${term}%` } },
          { type: { [Op.iLike]: `%${term}%` } },
          { tags: { [Op.iLike]: `%${term}%` } },
          { languageTags: { [Op.iLike]: `%${term}%` } },
          { description: { [Op.iLike]: `%${term}%` } },
          { coverImageText: { [Op.iLike]: `%${term}%` } },
          { contributors: { [Op.iLike]: `%${term}%` } }
        ]
      }
    }));
  }

  if (filters.category) {
    whereClause[Op.and] = whereClause[Op.and] || [];
    whereClause[Op.and].push({
      'data.category': {
        [Op.iLike]: `%${filters.category}%`
      }
    });
  }

  if (filters.profileId) {
    whereClause[Op.and] = whereClause[Op.and] || [];
    whereClause[Op.and].push({
      'data.profileId': {
        [Op.eq]: filters.profileId
      }
    });
  }

  if (filters.tags) {
    const tagSearch = filters.tags.split(',');
    if (!whereClause[Op.and]) {
      whereClause[Op.and] = [];
    }
    whereClause[Op.and].push({
      [Op.or]: tagSearch.map((term: string) => ({
        'data.tags': { [Op.iLike]: `%${term.trim()}%` }
      }))
    });
  }

  if (filters.languageTags) {
    const tagSearch = filters.languageTags.split(',');
    if (!whereClause[Op.and]) {
      whereClause[Op.and] = [];
    }
    whereClause[Op.and].push({
      [Op.or]: tagSearch.map((term: string) => ({
        'data.languageTags': { [Op.iLike]: `%${term.trim()}%` }
      }))
    });
  }

  const contentList = await Content.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']],
    offset,
    limit
  });

  return contentList;
};

/**
 * List content by profile ID with optional filters.
 *
 * @function
 * @name listContentByProfileId
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The limit for pagination.
 * @param {Object} filters - The filters to apply to the search.
 * @param {string} [profileId] - The ID of the profile.
 * @returns {Promise<Content[]>} The list of content objects that match the search criteria.
 */
export const listContentByProfileId = async (offset: number, limit: number, filters: any, profileId?: string) => {
  const whereClause: any = {
    [Op.and]: [
      {
        [Op.or]: [
          profileId
            ? [
                {
                  'data.profileId': {
                    [Op.eq]: profileId
                  }
                }
              ]
            : [],
          ...(filters.category
            ? [
                {
                  'data.category': {
                    [Op.contains]: JSON.stringify(filters.category)
                  }
                }
              ]
            : [])
        ]
      }
    ]
  };

  const contentList = await Content.findAll({
    where: whereClause,
    offset,
    limit
  });

  return contentList;
};

/**
 * Get VTT by its ID.
 *
 * @function
 * @name getVTTById
 * @param {string} id - The ID of the VTT to retrieve.
 * @returns {Promise<Vtt|null>} The VTT object, or null if not found.
 * @throws {Error} If the VTT retrieval fails.
 */
export const getVTTById = async (id: string) => {
  try {
    return await Vtt.findOne({ where: { id } });
  } catch (error) {
    throw new Error(`Failed to get VTT with id ${id}: ${error}`);
  }
};

/**
 * Update VTT with a new transcript.
 *
 * @function
 * @name updateVTT
 * @param {string} id - The ID of the VTT to update.
 * @param {any} transcript - The new transcript data.
 * @returns {Promise<Vtt>} The updated VTT object.
 * @throws {Error} If the VTT update fails.
 */
export const updateVTT = async (id: string, transcript: any) => {
  try {
    const updatedVTT = await Vtt.update({ transcript }, { where: { id }, returning: true });
    return updatedVTT[1][0];
  } catch (error) {
    throw new Error(`Failed to update VTT with id ${id}: ${error}`);
  }
};
