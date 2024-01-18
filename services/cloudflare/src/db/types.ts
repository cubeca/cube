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
