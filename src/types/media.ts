import { MediaCategories, MediaTypes } from './enums';
//"This would have to change to ContentCategories, ContentTypes  & this file would become content.ts"//

export interface Video {
  id: string;
  title: string;
  creator: string;
  url: string;
  thumbnailUrl: string;
  iconUrl: string;
  category: MediaCategories;
  type: MediaTypes;
}

export interface VideoList {
  videos: Video[];
}
//"Because we have VideList I assume we will have AudioList & PdfList & LinkList which all filter through FeaturedContent formerly VideoLists"

export interface VideoListAPIResponse {
  data: VideoList;
}

export interface VideoDetails {
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

export interface VideoDetailsAPIResponse {
  data: VideoDetails;
}

export interface MediaPayload {
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

export interface MediaAPIResponse {
  data: {
    id: string;
  };
}
