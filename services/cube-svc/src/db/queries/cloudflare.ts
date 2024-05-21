import { File } from '../models';
import { FileStatus, S3FileData, VideoFileData, StorageType } from '../../types/cloudflare';

export const insertVideoFileStubWithForcedFileId = async (fileId: string, data: VideoFileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    id: fileId,
    storage_type: StorageType.CloudflareStream,
    data: data
  });

  return file;
};

export const updateVideoFileWithCfStreamUid = async (fileId: string, cloudflareStreamUid: string, tusUploadUrl: string) => {
  const updateVideoFileWithCfStreamUid = await File.update(
    {
      data: {
        status: FileStatus.UploadAuthorized,
        cloudflareStreamUid: cloudflareStreamUid,
        upload: {
          debug: {
            tusUploadUrl: tusUploadUrl
          }
        }
      }
    },
    {
      where: {
        id: fileId
      },
      returning: true
    }
  );

  return updateVideoFileWithCfStreamUid[1][0];
};

export const insertS3FileStub = async (data: S3FileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    storage_type: StorageType.CloudflareR2,
    data: data
  });

  return file;
};

export const updateS3FileWithPresignedUrl = async (fileId: string, filePathInBucket: string, presignedUrl: string) => {
  const updateS3FileWithPresignedUrl = await File.update(
    {
      data: {
        status: FileStatus.UploadAuthorized,
        filePathInBucket: filePathInBucket,
        presignedUrl: presignedUrl
      }
    },
    {
      where: {
        id: fileId
      },
      returning: true
    }
  );

  return updateS3FileWithPresignedUrl[1][0];
};

export const getFileById = async (fileId: string) => {
  return await File.findOne({ where: { id: fileId } });
};

export const deleteFileById = async (fileId: string) => {
  const file = await File.findOne({ where: { id: fileId } });
  if (!file) {
    throw new Error('File not found');
  }

  return await file.destroy();
};
