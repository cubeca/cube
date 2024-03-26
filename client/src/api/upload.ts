import axios from 'axios';
import EventEmitter from 'events';

import { Upload } from 'tus-js-client';
import { uploadApi, getUploadTusEndpoint } from '.';
import { makeUUID } from './helpers';

export const progressEmitter = new EventEmitter();

export const upload = async (
  file: File,
  profileId: string
): Promise<string | undefined> => {
  const mimeType = file.type;
  if (mimeType.startsWith('video')) {
    const fileId = makeUUID();
    try {
      const uploadTusEndpoint = await getUploadTusEndpoint(fileId);
      await uploadViaTus(file, uploadTusEndpoint, { profileId });
      return fileId;
    } catch (error) {
      throw new Error(`Failed to process upload: ${error}`);
    }
  } else {
    return await uploadS3(file, profileId);
  }
};

export type ProgressHandler = (
  bytesUploaded: number,
  bytesTotal: number
) => void;

export const uploadViaTus = async (
  file: File,
  uploadTusEndpoint: string,
  meta: any
): Promise<undefined> => {
  return await new Promise((resolve, reject) => {
    const options = {
      endpoint: uploadTusEndpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      chunkSize: 50 * 1024 * 1024,
      metadata: {
        fileName: file.name,
        mimeType: file.type,
        allocVidTime: 21600,
        ...meta
      },
      onError(error: any) {
        reject(error);
      },
      onProgress: (bytesUploaded: number, bytesTotal: number) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(
          `uploadViaTus ${bytesUploaded}/${bytesTotal} = ${percentage}%`
        );
        progressEmitter.emit('progress', { bytesUploaded, bytesTotal });
      },
      onSuccess() {
        resolve(undefined);
      }
    };

    const upload = new Upload(file, options);

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads: any) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  });
};

export const uploadS3 = async (
  file: File,
  profileId: string
): Promise<string | undefined> => {
  const fileName = file.name;
  const mimeType = file.type;
  const fileSizeBytes = file.size;

  const {
    data: { fileId, presignedUrl }
  } = await uploadApi.uploadFilesViaPresignedUrl({
    profileId,
    upload: {
      fileName,
      fileSizeBytes,
      mimeType,
      urlValidDurationSeconds: 5 * 60
    }
  });

  const r2PutOptions = {
    timeout: 10 * 60 * 1000,
    validateStatus: null,
    headers: {
      'Content-Type': mimeType
    }
  };
  await axios.put(presignedUrl, file, r2PutOptions);

  return fileId;
};
