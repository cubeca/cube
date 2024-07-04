import { File } from '../models';
import { FileStatus, S3FileData, VideoFileData, StorageType } from '../../types/cloudflare';

/**
 * Insert a video file stub with a forced file ID.
 *
 * @function
 * @name insertVideoFileStubWithForcedFileId
 * @param {string} fileId - The ID of the file to insert.
 * @param {VideoFileData} data - The data of the video file.
 * @returns {Promise<File>} The inserted file.
 */
export const insertVideoFileStubWithForcedFileId = async (fileId: string, data: VideoFileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    id: fileId,
    storage_type: StorageType.CloudflareStream,
    data: data
  });

  return file;
};

/**
 * Update a video file with Cloudflare Stream UID and TUS upload URL.
 *
 * @function
 * @name updateVideoFileWithCfStreamUid
 * @param {string} fileId - The ID of the file to update.
 * @param {string} cloudflareStreamUid - The Cloudflare Stream UID.
 * @param {string} tusUploadUrl - The TUS upload URL.
 * @returns {Promise<File>} The updated file.
 */
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

/**
 * Insert an S3 file stub.
 *
 * @function
 * @name insertS3FileStub
 * @param {S3FileData} data - The data of the S3 file.
 * @returns {Promise<File>} The inserted file.
 */
export const insertS3FileStub = async (data: S3FileData) => {
  data.status = FileStatus.Stub;

  const file = await File.create({
    storage_type: StorageType.CloudflareR2,
    data: data
  });

  return file;
};

/**
 * Update an S3 file with a presigned URL.
 *
 * @function
 * @name updateS3FileWithPresignedUrl
 * @param {string} fileId - The ID of the file to update.
 * @param {string} filePathInBucket - The file path in the S3 bucket.
 * @param {string} presignedUrl - The presigned URL.
 * @returns {Promise<File>} The updated file.
 */
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

/**
 * Get a file by its ID.
 *
 * @function
 * @name getFileById
 * @param {string} fileId - The ID of the file to retrieve.
 * @returns {Promise<File|null>} The file, or null if not found.
 */
export const getFileById = async (fileId: string) => {
  return await File.findOne({ where: { id: fileId } });
};

/**
 * Delete a file by its ID.
 *
 * @function
 * @name deleteFileById
 * @param {string} fileId - The ID of the file to delete.
 * @returns {Promise<void>} A promise that resolves when the file is deleted.
 * @throws {Error} If the file is not found.
 */
export const deleteFileById = async (fileId: string) => {
  const file = await File.findOne({ where: { id: fileId } });
  if (!file) {
    throw new Error('File not found');
  }

  return await file.destroy();
};
