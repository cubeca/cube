import { Content, ContentDetails, ContentList } from '../../types/content';
import { ContentCategories, ContentTypes } from '../../types/enums';

export const createContentList = (num: number): Content[] => {
  return [...Array(num)].map((content, i) => ({
    id: `${i + 1}`,
    title: `Title ${i + 1}`,
    creator: `Creator ${i + 1}`,
    url: `/content/${i + 1}`,
    thumbnailUrl: 'images/video_thumbnail.jpg',
    iconUrl: 'images/creator_icon.png',
    category: ContentCategories.Video,
    type: ContentTypes.Video
  }));
};

export const CONTENT_DETAILS: ContentDetails = {
  id: '1',
  url: '/video.mp4',
  title: 'Video 1',
  createdDate: '07/01/2022',
  updatedDate: '07/01/2022',
  description:
    'Description of content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor sem faucibus auctor quam pretium massa nulla cursus. Vel, a nisl ipsum, nisl. Mauris.',
  descriptionUrl: '/description.mp3',
  credits:
    'Dawn Powell, Camera Operator, Alissa Cat, Public Programs Magnus Ten, Editor',
  contributors: [
    {
      id: '1',
      link: '/profile/1',
      name: 'Museum Of Anthropology',
      socialUrl: 'https://www.twitter.com',
      socialHandle: '@Moa',
      logoUrl: '/images/moa.svg'
    },
    {
      id: '2',
      name: 'Museum of Vancouver',
      socialUrl: 'https://www.twitter.com',
      socialHandle: '@Mov',
      logoUrl: ''
    },
    {
      id: '3',
      name: 'Dana Claxton'
    }
  ],
  tags: ['tag 1', 'tag 2']
};

export const FEATURED_CONTENT: ContentList = { content: createContentList(7) };
