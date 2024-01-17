import { File } from './models';

export enum FileStatus {
  Stub = 'stub',
  UploadAuthorized = 'uploadAuthorized'
}

export interface CommonDebugInfo {
  urlValidDurationSeconds: number;
}

export interface CommonUploadInfo {
  userId: string;
  fileName: string;
  fileSizeBytes: number;
  debug: CommonDebugInfo;
}

export interface CommonFileData {
  status?: FileStatus;
  profileId: string;
  upload: CommonUploadInfo;
}

export interface VideoDebugInfo extends CommonDebugInfo {
  reserveDurationSeconds: number;
  tusUploadUrl?: string;
}

export interface VideoUploadInfo extends CommonUploadInfo {
  debug: VideoDebugInfo;
}

export interface VideoFileData extends CommonFileData {
  upload: VideoUploadInfo;
  cloudflareStreamUid?: string;
}

export interface S3DebugInfo extends CommonDebugInfo {
  presignedUrl?: string;
}

export interface S3UploadInfo extends CommonUploadInfo {
  mimeType: string;
  debug: S3DebugInfo;
}

export interface S3FileData extends CommonFileData {
  upload: S3UploadInfo;
  filePathInBucket?: string;
}

export const insertVideoFileStub = async (data: VideoFileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    storage_type: 'cloudflareStream',
    data: data
  });

  return file.toJSON();
};

export const insertVideoFileStubWithForcedFileId = async (fileId: string, data: VideoFileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    id: fileId,
    storage_type: 'cloudflareStream',
    data: data
  });

  return file.toJSON();
};

export const updateVideoFileWithCfStreamUid = async (
  fileId: string,
  cloudflareStreamUid: string,
  tusUploadUrl: string
) => {
  try {
    const file = await File.findOne({ where: { id: fileId } });
    if (file) {
      const data = file.data as VideoFileData;
      data.status = FileStatus.UploadAuthorized;
      data.upload.debug.tusUploadUrl = tusUploadUrl;
      data.cloudflareStreamUid = cloudflareStreamUid;
      await file.save();
    }
  } catch (error) {
    console.error('Error updating video file with Cloudflare Stream UID:', error);
    throw error;
  }
};

export const insertS3FileStub = async (data: S3FileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    storage_type: 'cloudflareR2',
    data: data
  });

  return file;
};

export const updateS3FileWithPresignedUrl = async (fileId: string, filePathInBucket: string, presignedUrl: string) => {
  try {
    const file = await File.findOne({ where: { id: fileId } });
    if (file) {
      const data = file.data as S3FileData;
      data.status = FileStatus.UploadAuthorized;
      data.upload.debug.presignedUrl = presignedUrl;
      data.filePathInBucket = filePathInBucket;
      await file.save();
    }
  } catch (error) {
    console.error('Error updating S3 file with presigned URL:', error);
    throw error;
  }
};

export const getFileById = async (fileId: string) => {
  try {
    return await File.findOne({ where: { id: fileId } });
  } catch (error) {
    console.error('Error retrieving file by id:', error);
    throw error;
  }
};
