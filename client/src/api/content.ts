import { upload } from './upload';
import { contentApi } from '.';
import {
  AddContentRequest,
  ReportContentRequest
} from '@cubeca/cube-svc-client-oas-axios';

import EventEmitter from 'events';
const progressEmitter = new EventEmitter();

export type CategoryType =
  | 'all'
  | 'video'
  | 'audio'
  | 'vr'
  | 'pdf'
  | 'digital-publications'
  | 'talks'
  | 'performances'
  | 'link'
  | 'cultural-teachings';

export type ContentType = 'video' | 'audio' | 'pdf' | 'link';

export type NationType = 'CA';

export const getContent = async (
  category?: CategoryType,
  type?: ContentType,
  nation?: NationType,
  creator?: string
) => {
  //return await contentApi.contentList(1, 10, category, type, nation, creator);
};

export const getContentDetails = async (id: string) => {
  return await contentApi.getContent(id);
};

export const getContentByProfileId = async (profileId: string) => {
  return await contentApi.getContentByProfileid(0, 10, profileId);
};

export const addContent = async ({
  payload,
  coverImageFile,
  bannerImageFile,
  mediaFile,
  vttFile
}: {
  payload: AddContentRequest;
  coverImageFile?: File;
  bannerImageFile?: File;
  mediaFile?: File;
  vttFile?: File;
}) => {
  if (coverImageFile) {
    const fileId = await upload(coverImageFile, payload.profileId);
    if (fileId) {
      payload.coverImageFileId = fileId;
    }
  }
  if (bannerImageFile) {
    const fileId = await upload(bannerImageFile, payload.profileId);
    if (fileId) {
      payload.bannerImageFileId = fileId;
    }
  }

  if (mediaFile) {
    const fileId = await upload(mediaFile, payload.profileId);

    progressEmitter.on('progress', ({ bytesUploaded, bytesTotal }) => {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      console.log(`Upload Progress from client: ${percentage}%`);
    });

    if (fileId) {
      payload.mediaFileId = fileId;
    }
  }

  if (vttFile) {
    const fileId = await upload(vttFile, payload.profileId);
    if (fileId) {
      payload.vttFileId = fileId;
    }
  }

  return await contentApi.addContent(payload);
};

export const getVTT = async (id: string) => {
  return await contentApi.getVtt(id);
};

export const updateVTT = async (id: string, transcript: any) => {
  return await contentApi.updateVtt(id, transcript);
};
export const deleteContent = async (contentId: string) => {
  return await contentApi.deleteContent(contentId);
};

export const reportContent = async (
  disputedUrl: string,
  requestType: string,
  contactName: string,
  contactEmail: string,
  issueDesc: string,
  ticketId: string
) => {
  return await contentApi.reportContent({
    disputedUrl,
    requestType,
    contactName,
    contactEmail,
    issueDesc,
    ticketId
  } as ReportContentRequest);
};
