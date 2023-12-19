import axios from 'axios';

import { Upload } from 'tus-js-client';
import { uploadApi, getUploadTusEndpoint } from '.';
import { makeUUID } from './helpers';

export const upload = async (
  file: File,
  profileId: string
): Promise<string | undefined> => {
  const mimeType = file.type;
  if (mimeType.startsWith('video')) {
    // This is just a hack until the Files & Upload APIs get refactored,
    // to allow creating a file stub with ID in a separate API call before triggering TUS.
    // TODO Replace with API call to create file stub.
    const fileId = makeUUID();

    const uploadTusEndpoint = await getUploadTusEndpoint(fileId);
    await uploadViaTus(file, uploadTusEndpoint, { profileId });
    return fileId;
  } else {
    return await uploadS3(file, profileId);
  }
};

export type ProgressHandler = (
  bytesUploaded: number,
  bytesTotal: number
) => void;

const defaultProgressHandler: ProgressHandler = (
  bytesUploaded: number,
  bytesTotal: number
) => {
  const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
  console.log(`uploadViaTus ${bytesUploaded}/${bytesTotal} = ${percentage}%`);
};

export const uploadViaTus = async (
  file: File,
  uploadTusEndpoint: string,
  meta: any,
  progressHandler: ProgressHandler = defaultProgressHandler
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
      onProgress: progressHandler,
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

  // Do *NOT* wait, intentionally.
  // TODO Improve async error handling and progress reporting.
  await axios.put(presignedUrl, file, r2PutOptions);

  return fileId;
};
