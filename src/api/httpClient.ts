import axios from 'axios';

import { API_URL } from './constants';
import {
  Configuration,
  ContentApiFp,
  ContentFilesApiFp,
  UserApiFp
} from 'cubeca-bff-client';

// Call backend requests via generated client
const configuration = new Configuration({
  basePath: API_URL
});

export const contentApi = ContentApiFp(configuration);
export const contentFilesApi = ContentFilesApiFp(configuration);
export const profileApi = UserApiFp(configuration);
export type { AddContent, ProfileMainSchema } from 'cubeca-bff-client';

// Standard http requests
const httpClient = axios.create({
  baseURL: API_URL
});

export default httpClient;
