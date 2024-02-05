import { Playlist, User } from '../models';
import { Op } from 'sequelize';

export const getPlaylistById = async (playlistId: string) => {
  return await Playlist.findOne({
    where: {
      id: playlistId
    }
  });
};

export const listPlaylistsByProfileAndUserId = async (offset: number, limit: number, filters: any, profileId?: string, userId?: string) => {
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
  return await Playlist.update({ data }, { where: { id: playlistId } });
};

export const listPlaylists = async (offset: number, limit: number) => {
  return await Playlist.findAll({ offset, limit });
};
