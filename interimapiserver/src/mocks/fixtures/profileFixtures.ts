import { MediaCategories } from '../../types/enums';
import { Profile } from '../../types/profile';
import { createVideoList } from './videosFixtures';

export const PROFILE: Profile = {
  id: '1',
  name: 'MOA',
  heroUrl: '/images/profile-hero.jpg',
  logoUrl: '/images/moa.svg',
  description:
    'Description of MOA Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare risus pretium vivamus leo, pharetra placerat mauris, viverra. Phasellus parturient amet sapien praesent semper tellus porttitor at auctor. Faucibus in at blandit dui eget in ut enim. Ultricies eu, lobortis vitae bibendum nunc tempor. Quam.',
  descriptionUrl:
    'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3',
  videos: [
    {
      category: MediaCategories.Video,
      videos: createVideoList(3)
    }
  ]
};
