import { ContentCategories } from './enums';
import { Content } from './content';

export interface ProfileContent {
  category: ContentCategories;
  content: Content[];
}

export interface Profile {
  id: string;
  name: string;
  heroUrl?: string;
  logoUrl?: string;
  description: string;
  descriptionUrl: string;
  content: ProfileContent[];
}

export interface ProfileAPIResponse {
  data: Profile;
}
