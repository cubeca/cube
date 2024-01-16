import { Content } from './models';
import { Vtt } from './models';
import { User } from './models';
import { Op } from 'sequelize';

export const getContentById = async (contentId: string) => {
  return await Content.findOne({ where: { id: contentId } });
};

export const listContentByProfileId = async (offset: number, limit: number, filters: any, profileId?: string) => {
  try {
    const searchTerm = filters.searchTerm ? filters.searchTerm.split('&') : [];
    const whereClause: any = {
      profile_id: profileId,
      ...filters,
      data: {
        [Op.and]: searchTerm.map((term: string) => ({
          [Op.like]: `%${term}%`
        }))
      }
    };

    const contentList = await Content.findAll({
      where: whereClause,
      offset,
      limit
    });

    return contentList;
  } catch (error) {
    throw new Error('Failed to list content');
  }
};

export const insertContent = async (data: any) => {
  return await Content.create({ data });
};

export const updateContent = async (data: any, contentId: string) => {
  const content = await Content.findOne({ where: { id: contentId } });
  if (!content) {
    throw new Error('Content not found');
  }

  content.data = data;
  await content.save();

  return content;
};

export const deleteContent = async (contentId: string) => {
  const content = await Content.findOne({ where: { id: contentId } });
  if (!content) {
    throw new Error('Content not found');
  }

  return await content.destroy();
};

export const isUserAssociatedToProfile = async (uuid: string, profileId: string) => {
  const user = await User.findOne({ where: { id: uuid, profile_id: profileId } });
  return !!user;
};

export const searchContent = async (offset: number, limit: number, filters: any, searchTerm: string) => {
  const searchTerms = searchTerm
    .split('&')
    .map((term) => term.trim())
    .filter((term) => term);

  const whereClause: any = {
    data: {
      [Op.or]: searchTerms.map((term: string) => ({
        [Op.like]: `%${term}%`
      }))
    },
    ...filters
  };

  const contentList = await Content.findAll({
    where: whereClause,
    offset,
    limit
  });

  return contentList;
};

export const getVTTById = async (id: string) => {
  try {
    return await Vtt.findOne({ where: { id } });
  } catch (error) {
    throw new Error(`Failed to get VTT with id ${id}: ${error}`);
  }
};

export const updateVTT = async (id: string, transcript: any) => {
  try {
    const updatedVTT = await Vtt.update({ transcript }, { where: { id }, returning: true });
    return updatedVTT[1][0];
  } catch (error) {
    throw new Error(`Failed to update VTT with id ${id}: ${error}`);
  }
};
