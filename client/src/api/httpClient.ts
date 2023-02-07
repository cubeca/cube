import axios from 'axios';

import { API_URL, AUTH_SERVICE_URL } from './constants';
import {
  Configuration,
  ContentApiFp,
  ContentFilesApiFp,
  ProfileApiFp
} from '@cubeca/bff-client-oas-axios';
import { AuthApiFp } from '@cubeca/bff-auth-client-oas-axios';

// Call backend requests via generated client
const configuration = new Configuration({
  basePath: API_URL
});

const authConfiguration = new Configuration({
  basePath: AUTH_SERVICE_URL
});

export const contentApi = ContentApiFp(configuration);
export const contentFilesApi = ContentFilesApiFp(configuration);
export const profileApi = ProfileApiFp(configuration);
export const authApi = AuthApiFp(authConfiguration);
export type {
  AddContent,
  ProfileMainSchema
} from '@cubeca/bff-client-oas-axios';

// Standard http requests
const httpClient = axios.create({
  baseURL: API_URL
});

export default httpClient;