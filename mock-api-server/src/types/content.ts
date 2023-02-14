import { ContentCategories, ContentTypes } from './enums';

export interface Content {
  id: string;
  title: string;
  creator: string;
  url: string;
  thumbnailUrl: string;
  iconUrl: string;
  category: ContentCategories;
  type: ContentTypes;
}

export interface ContentList {
  content: Content[];
}

export interface ContentListAPIResponse {
  data: ContentList;
}

export interface ContentDetails {
  id: string;
  url: string;
  title: string;
  createdDate: string;
  updatedDate: string;
  description: string;
  descriptionUrl: string;
  credits: string;
  contributors: Contributor[];
  tags: string[];
}

export interface Contributor {
  id: string;
  link?: string;
  name: string;
  socialUrl?: string;
  socialHandle?: string;
  logoUrl?: string;
}

export interface ContentDetailsAPIResponse {
  data: ContentDetails;
}
