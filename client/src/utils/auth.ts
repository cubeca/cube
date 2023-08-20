import { anonymousJWT } from 'api/auth';

const AUTH_TOKEN = 'AUTH_TOKEN';
const PROFILE_ID = 'PROFILE_ID';

export const getAuthToken = async (): Promise<string | null> => {
  let jwt = localStorage.getItem(AUTH_TOKEN);
  if (!jwt) {
    jwt = await anonymousJWT();
  }
  return jwt;
};

export const getAuthTokenPayload = async (): Promise<
  Record<string, unknown>
> => {
  const tokenParts = String(await getAuthToken()).split('.');
  return tokenParts[1] ? JSON.parse(atob(tokenParts[1])) : {};
};

export const setAuthToken = (token: string) => {
  // TODO: Update to a more secure method for storing token
  localStorage.setItem(AUTH_TOKEN, token);
};

export const setProfileId = (id: string) => {
  localStorage.setItem(PROFILE_ID, id);
};

export const getProfileId = () => {
  return localStorage.getItem(PROFILE_ID);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(PROFILE_ID);
};

export const isAuthed = async () => {
  const payload = await getAuthTokenPayload();
  if (!(payload.aud as Array<string>).includes('anonymous')) {
    return true;
  }
  return false;
};
