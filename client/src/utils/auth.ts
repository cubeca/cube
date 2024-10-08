import { anonymousJWT } from 'api/auth';

const AUTH_TOKEN = 'AUTH_TOKEN';
const PROFILE_ID = 'PROFILE_ID';
const PROFILE = 'PROFILE';
const USER = 'USER';

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN, token);
};

export const getProfileId = () => {
  return localStorage.getItem(PROFILE_ID);
};

export const setProfileId = (id: string) => {
  localStorage.setItem(PROFILE_ID, id);
};

export const getProfile = () => {
  const profile = localStorage.getItem(PROFILE);
  if (profile) {
    return JSON.parse(profile);
  }
  return null;
};

export const getProfileTag = () => {
  const profile = localStorage.getItem('PROFILE');
  if (profile) {
    const profileObj = JSON.parse(profile);
    return profileObj.tag;
  }

  return null;
};

export const setUser = (user: any) => {
  localStorage.setItem(USER, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER);
  if (user) {
    return JSON.parse(user);
  }

  return null;
};

export const getAuthTokenPayload = () => {
  const tokenParts = String(getAuthToken()).split('.');
  return tokenParts[1] ? JSON.parse(atob(tokenParts[1])) : {};
};

export const getAnonymousToken = async () => {
  const token = await anonymousJWT();
  removeAuthToken();
  setAuthToken(token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(PROFILE_ID);
  localStorage.removeItem(PROFILE);
  localStorage.removeItem(USER);
};

export const hasSessionToken = () => {
  if (getAuthToken()) {
    const payload = getAuthTokenPayload();
    return (payload.aud as Array<string>).includes('active');
  } else {
    return false;
  }
};

export const isAuthed = async () => {
  if (await getAuthToken()) {
    const payload = getAuthTokenPayload();
    const currentTime = Math.floor(Date.now() / 1000);

    return (
      (payload.aud as Array<string>).includes('active') &&
      currentTime < (payload.exp as number)
    );
  } else {
    await getAnonymousToken();
    return false;
  }
};
