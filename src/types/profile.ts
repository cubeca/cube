import { MediaCategories } from './enums';
import { Video } from './media';

export interface ProfileVideos {
  category: MediaCategories;
  videos: Video[];
}

export interface Profile {
  id: string;
  name: string;
  heroUrl?: string;
  logoUrl?: string;
  description: string;
  descriptionUrl: string;
  videos: ProfileVideos[];
}

export interface ProfileAPIResponse {
  data: Profile;
}
