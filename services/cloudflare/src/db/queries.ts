import { File } from './models';
import { FileStatus, S3FileData, VideoFileData } from './types';

export const insertVideoFileStubWithForcedFileId = async (fileId: string, data: VideoFileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    id: fileId,
    storage_type: 'cloudflareStream',
    data: data
  });

  return file;
};

export const updateVideoFileWithCfStreamUid = async (
  fileId: string,
  cloudflareStreamUid: string,
  tusUploadUrl: string
) => {
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
    storage_type: 'cloudflareR2',
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
