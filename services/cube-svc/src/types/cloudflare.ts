export enum FileStatus {
  Stub = 'stub',
  UploadAuthorized = 'uploadAuthorized'
}

export enum StorageType {
  CloudflareStream = 'cloudflareStream',
  CloudflareR2 = 'cloudflareR2'
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

export interface VideoPlayerInfo {
  hlsUrl?: string;
  dashUrl?: string;
  videoIdOrSignedUrl?: string;
}

export interface NonVideoPlayerInfo {
  mimeType: string;
  fileType: string;
  publicUrl: string;
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
