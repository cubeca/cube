import { Playlist } from '../models';
import { Op } from 'sequelize';

interface PlaylistData {
  contentIds: string[];
}

/**
 * Get a playlist by its ID.
 *
 * @function
 * @name getPlaylistById
 * @param {string} playlistId - The ID of the playlist to retrieve.
 * @returns {Promise<Playlist|null>} The playlist object, or null if not found.
 */
export const getPlaylistById = async (playlistId: string) => {
  return await Playlist.findOne({
    where: {
      id: playlistId
    }
  });
};

/**
 * List playlists by profile ID or user ID with pagination.
 *
 * @function
 * @name listPlaylistsByProfileOrUserId
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The limit for pagination.
 * @param {string} [profileId] - The profile ID to filter playlists.
 * @param {string} [userId] - The user ID to filter playlists.
 * @returns {Promise<Playlist[]>} The list of playlists that match the criteria.
 */
export const listPlaylistsByProfileOrUserId = async (offset: number, limit: number, profileId?: string, userId?: string) => {
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
          userId
            ? [
                {
                  'data.userId': {
                    [Op.eq]: userId
                  }
                }
              ]
            : []
        ]
      }
    ]
  };

  const playlistList = await Playlist.findAll({
    where: whereClause,
    order: [['created_at', 'DESC']],
    offset,
    limit
  });

  return playlistList;
};

/**
 * Search playlists based on filters and a search term with pagination.
 *
 * @function
 * @name searchPlaylist
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The limit for pagination.
 * @param {Object} filters - The filters to apply to the search.
 * @param {string} searchTerm - The search term to use.
 * @returns {Promise<Playlist[]>} The list of playlists that match the search criteria.
 */
export const searchPlaylist = async (offset: number, limit: number, filters: any, searchTerm: string) => {
  const searchTerms = searchTerm
    .split('&')
    .map((term) => term.trim())
    .filter((term) => term);

  const whereClause: any = {
    [Op.and]: [
      {
        [Op.and]: [
          ...searchTerms.map((term: string) => ({
            data: {
              [Op.or]: [{ title: { [Op.iLike]: `%${term}%` } }, { description: { [Op.iLike]: `%${term}%` } }]
            }
          })),
          ...(filters.profileId
            ? [
                {
                  'data.profileId': {
                    [Op.eq]: filters.profileId
                  }
                }
              ]
            : []),
          ...(filters.contentId
            ? [
                {
                  'data.contentIds': {
                    [Op.iLike]: `%${filters.contentId}%`
                  }
                }
              ]
            : [])
        ]
      }
    ]
  };

  const playlistList = await Playlist.findAll({
    where: whereClause,
    offset,
    limit
  });

  return playlistList;
};

/**
 * Add content to a playlist.
 *
 * @function
 * @name addContentToPlaylist
 * @param {string} playlistId - The ID of the playlist to update.
 * @param {string} contentId - The ID of the content to add to the playlist.
 * @returns {Promise<Playlist|null>} The updated playlist object, or null if not found.
 */
export const addContentToPlaylist = async (playlistId: string, contentId: string) => {
  const playlist = (await Playlist.findOne({ where: { id: playlistId } })) as { data: PlaylistData };

  if (playlist) {
    const contentIds = playlist.data.contentIds || [];
    if (!contentIds.includes(contentId)) {
      const updatedData = { ...playlist.data, contentIds: [...contentIds, contentId] };
      return await Playlist.update({ data: updatedData }, { where: { id: playlistId }, returning: true });
    }
  }
};

/**
 * Remove content from a playlist.
 *
 * @function
 * @name removeContentFromPlaylist
 * @param {string} playlistId - The ID of the playlist to update.
 * @param {string} contentId - The ID of the content to remove from the playlist.
 * @returns {Promise<Playlist|null>} The updated playlist object, or null if not found.
 */
export const removeContentFromPlaylist = async (playlistId: string, contentId: string) => {
  const playlist = (await Playlist.findOne({ where: { id: playlistId } })) as { data: PlaylistData };

  if (playlist) {
    const contentIds = playlist.data.contentIds || [];
    const updatedContentIds = contentIds.filter((id: string) => id !== contentId);
    const updatedData = { ...playlist.data, contentIds: updatedContentIds };
    return await Playlist.update({ data: updatedData }, { where: { id: playlistId }, returning: true });
  }
};

/**
 * Check if a user is associated with a playlist.
 *
 * @function
 * @name isUserAssociatedToPlaylist
 * @param {string} uuid - The UUID of the user.
 * @param {string} playlistId - The ID of the playlist.
 * @returns {Promise<boolean>} True if the user is associated with the playlist, false otherwise.
 */
export const isUserAssociatedToPlaylist = async (uuid: string, playlistId: string) => {
  const user = await Playlist.findOne({ where: { 'data.userId': uuid, id: playlistId } });
  return !!user;
};

/**
 * Delete a playlist by its ID.
 *
 * @function
 * @name deletePlaylist
 * @param {string} playlistId - The ID of the playlist to delete.
 * @returns {Promise<void>} A promise that resolves when the playlist is deleted.
 */
export const deletePlaylist = async (playlistId: string) => {
  return await Playlist.destroy({ where: { id: playlistId } });
};

/**
 * Insert a new playlist into the database.
 *
 * @function
 * @name insertPlaylist
 * @param {Object} data - The data of the playlist to insert.
 * @returns {Promise<Playlist>} The inserted playlist object.
 */
export const insertPlaylist = async (data: any) => {
  return await Playlist.create({ data });
};

/**
 * Update a playlist in the database.
 *
 * @function
 * @name updatePlaylist
 * @param {string} playlistId - The ID of the playlist to update.
 * @param {Object} data - The updated data of the playlist.
 * @returns {Promise<Playlist>} The updated playlist object.
 */
export const updatePlaylist = async (playlistId: string, data: any) => {
  const updatedPlaylist = await Playlist.update({ data }, { where: { id: playlistId }, returning: true });
  return updatedPlaylist[1][0];
};

/**
 * List playlists with pagination.
 *
 * @function
 * @name listPlaylists
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The limit for pagination.
 * @returns {Promise<Playlist[]>} The list of playlists.
 */
export const listPlaylists = async (offset: number, limit: number) => {
  return await Playlist.findAll({ offset, limit });
};
