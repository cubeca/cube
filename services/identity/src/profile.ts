import axios from 'axios';

import * as settings from './settings';

const profileApi = axios.create({
  baseURL: settings.PROFILE_SERVICE_URL,
  timeout: 10 * 1000,

  // Do not throw errors for non-2xx responses, that makes handling them easier.
  validateStatus: null
});

// export interface Headers {
//   [k: string]: string;
// }

// const authHeader: Headers = {
//   Authorization: `bearer ${settings.CLOUDFLARE_API_TOKEN}`
// };

export const createDefaultProfile = async (organization: string, website: string, tag: string) => {
  try {
    const { status, statusText, headers, data } = await profileApi.post(`/profiles`, {
      organization,
      website,
      tag
    });

    // console.dir({ status, statusText, headers, data }, {depth:null});

    return data.id;
  } catch (e: any) {
    console.log(e);
    throw e;
  }
};
