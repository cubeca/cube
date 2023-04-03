import axios from 'axios';

import { Upload, HttpRequest, HttpResponse } from 'tus-js-client';
import { UPLOAD_TUS_ENDPOINT, filesApi } from '.';
import { getAuthToken } from '../utils/auth';

export const upload = async (
  file: File,
  profileId: string
): Promise<string | undefined> => {
  const mimeType = file.type;
  if (mimeType.startsWith('video')) {
    return await uploadViaTus(file, { profileId });
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
  meta: any,
  progressHandler: ProgressHandler = defaultProgressHandler
): Promise<string | undefined> => {
  const authToken = await getAuthToken();
  return await new Promise((resolve, reject) => {
    let fileId: string | undefined = undefined;

    const options = {
      endpoint: UPLOAD_TUS_ENDPOINT,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        fileName: file.name,
        mimeType: file.type,

        // TODO remove this hack (tries to reserve 1 minute per 1 MB filesize)
        allocVidTime: Math.ceil(60 * (file.size / 1000000)),

        ...meta
      },
      onBeforeRequest(req: HttpRequest) {
        // Browsers can't send `Authorization` headers to https://upload.videodelivery.net/
        // because of CORS. So we have to send it only for the initial endpoint.
        if (req.getURL() === UPLOAD_TUS_ENDPOINT) {
          req.setHeader('Authorization', `Bearer ${authToken}`);
        }
      },
      onAfterResponse(req: HttpRequest, res: HttpResponse) {
        console.log(res.getStatus() && req.getURL())
        if (res.getStatus() === 200 && req.getURL() === UPLOAD_TUS_ENDPOINT) {
          fileId = res.getHeader('CUBE-File-Id');
          console.log(`got fileId from TUS endpoint: "${fileId}".`);
          resolve(fileId); // Resolve early, so we can get on with creating content.
        }
      },
      onError(error: any) {
        reject(error);
      },
      onProgress: progressHandler,
      onSuccess() {
        resolve(fileId);
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
  } = await filesApi.uploadFilesViaPresignedUrl({
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

    // Do not throw errors for non-2xx responses, that makes handling them easier.
    validateStatus: null,

    headers: {
      'Content-Type': mimeType,
      'Content-Length': fileSizeBytes
    },

    onUploadProgress: (progressEvent: any) => {
      // see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/progress_event
      console.log(`profile ${profileId} uploadS3 progress for ${fileName}`);
      console.dir(progressEvent);
    }
  };

  // Do *NOT* wait, intentionally.
  // TODO Improve async error handling and progress reporting.
  axios.put(presignedUrl, file, r2PutOptions);

  return fileId;
};

export const getFileDetails = async (fileId: string) => {
  return await filesApi.fileDetails(fileId);
};
