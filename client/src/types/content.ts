import { ContentCategories, ContentTypes } from './enums';
//"This would have to change to ContentCategories, ContentTypes  & this file would become content.ts"//

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
  artist?: boolean;
  socialHandle?: string;
  logoUrl?: string;
}

export interface ContentDetailsAPIResponse {
  data: ContentDetails;
}

export interface ContentPayload {
  profileId: string;
  type: string;
  title: string;
  expiry: string;
  description: string;
  coverImageFile: File;
  mediaFile: File;
  coverImageText: string;
  collaborators: string[];
  contributors: string[];
  tags?: string[];
}

export interface ContentAPIResponse {
  data: {
    id: string;
  };
}
