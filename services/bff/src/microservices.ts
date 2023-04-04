import { AuthApi } from '@cubeca/bff-auth-client-oas-axios';
import {
    Configuration,
    ContentApi,
    ContentFilesApi,
    ProfileApi,
    UploadApi,
    FilesApi
} from '@cubeca/bff-client-oas-axios';

import * as settings from './settings';

// `tus-js-client` expects to talk to this endpoint directly instead of going through our API client lib.
export const UPLOAD_TUS_ENDPOINT = `${settings.CLOUDFLARE_SERVICE_URL}/upload/video-tus-reservation`;

export const getUploadTusEndpoint = (
    fileId: string,
    authToken: string
): Promise<string> => {
    const url = new URL(UPLOAD_TUS_ENDPOINT)
    url.searchParams.set('fileId', fileId);
    url.searchParams.set('authorization', authToken);
    return url.toString();
};

const identityConfiguration = new Configuration({
    basePath: settings.IDENTITY_SERVICE_URL
});

export const identityApi = new AuthApi(identityConfiguration);

const profileConfiguration = new Configuration({
    basePath: settings.PROFILE_SERVICE_URL
});

export const profileApi = new ProfileApi(profileConfiguration);

const contentConfiguration = new Configuration({
    basePath: settings.CONTENT_SERVICE_URL
});

export const contentApi = new ContentApi(contentConfiguration);
export const contentFilesApi = new ContentFilesApi(contentConfiguration);

const uploadConfiguration = new Configuration({
    basePath: settings.CLOUDFLARE_SERVICE_URL
});

export const uploadApi = new UploadApi(uploadConfiguration);
export const filesApi = new FilesApi(uploadConfiguration);
