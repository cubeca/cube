import { Playlist } from '../models';
import { Op } from 'sequelize';

export const getPlaylistById = async (playlistId: string) => {
  return await Playlist.findOne({
    where: {
      id: playlistId
    }
  });
};

export const listPlaylistsByProfileAndUserId = async (offset: number, limit: number, profileId?: string, userId?: string) => {
  const whereClause: any = {
    [Op.and]: [
      {
        [Op.and]: [
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
    offset,
    limit
  });

  return playlistList;
};

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

export const isUserAssociatedToPlaylist = async (uuid: string, playlistId: string) => {
  const user = await Playlist.findOne({ where: { 'data.userId': uuid, id: playlistId } });
  return !!user;
};

export const deletePlaylist = async (playlistId: string) => {
  return await Playlist.destroy({ where: { id: playlistId } });
};

export const insertPlaylist = async (data: any) => {
  return await Playlist.create({ data });
};

export const updatePlaylist = async (playlistId: string, data: any) => {
  const updatedPlaylist = await Playlist.update({ data }, { where: { id: playlistId }, returning: true });
  return updatedPlaylist[1][0];
};

export const listPlaylists = async (offset: number, limit: number) => {
  return await Playlist.findAll({ offset, limit });
};
