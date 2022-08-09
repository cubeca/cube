import { Video, VideoDetails, VideoList } from 'types/media';
import { MediaCategories, MediaTypes } from 'types/enums';

export const createVideoList = (num: number): Video[] => {
  return [...Array(num)].map((video, i) => ({
    id: `${i + 1}`,
    title: `Title ${i + 1}`,
    creator: `Creator ${i + 1}`,
    url: `/videos/${i + 1}`,
    thumbnailUrl: 'images/video_thumbnail.jpg',
    iconUrl: 'images/creator_icon.png',
    category: MediaCategories.Video,
    type: MediaTypes.Video
  }));
};

export const VIDEO_DETAILS: VideoDetails = {
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
  tags: ['tag 1', 'tag 2', 'tag 3']
};

export const FEATURED_VIDEOS: VideoList = { videos: createVideoList(7) };
