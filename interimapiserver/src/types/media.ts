import { MediaCategories, MediaTypes } from './enums';

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
