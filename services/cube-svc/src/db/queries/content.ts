import { Content, Vtt, User } from '../models';
import { Op } from 'sequelize';

export const getContentById = async (contentId: string) => {
  return await Content.findOne({ where: { id: contentId } });
};

export const getContentByIdList = async (contentIdList: string[]) => {
  return await Content.findAll({ where: { id: contentIdList } });
};

export const insertContent = async (data: any) => {
  return await Content.create({ data });
};

export const updateContent = async (data: any, contentId: string) => {
  const updatedContent = await Content.update({ data }, { where: { id: contentId }, returning: true });
  return updatedContent[1][0];
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
    [Op.and]: [
      {
        [Op.and]: [
          ...searchTerms.map((term: string) => ({
            data: {
              [Op.or]: [
                { title: { [Op.iLike]: `%${term}%` } },
                { type: { [Op.iLike]: `%${term}%` } },
                { tags: { [Op.iLike]: `%${term}%` } },
                { description: { [Op.iLike]: `%${term}%` } },
                { coverImageText: { [Op.iLike]: `%${term}%` } },
                {
                  contributors: {
                    [Op.iLike]: `%${term}%`
                  }
                }
              ]
            }
          })),
          ...(filters.category
            ? [
                {
                  'data.category': {
                    [Op.iLike]: `%${filters.category}%`
                  }
                }
              ]
            : []),
          ...(filters.profileId
            ? [
                {
                  'data.profileId': {
                    [Op.eq]: filters.profileId
                  }
                }
              ]
            : []),
          ...(filters.tags
            ? [
                {
                  'data.tags': {
                    [Op.overlap]: filters.tags
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
            : []),

          ...(filters.tags
            ? [
                {
                  'data.tags': {
                    [Op.contains]: JSON.stringify(filters.tags)
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
