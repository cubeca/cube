import { anonymousJWT } from 'api/auth';

const AUTH_TOKEN = 'AUTH_TOKEN';
const ANON_TOKEN = 'ANON_TOKEN';

export const getAuthToken = async (): Promise<string | null> => {
  let jwt = localStorage.getItem(AUTH_TOKEN);
  if (!jwt) {
    jwt = await anonymousJWT();
    setAuthToken(jwt || '');
  }
  return jwt;
};

export const getAuthTokenPayload = async (): Promise<Record<string, unknown>> => {
  const tokenParts = String(await getAuthToken()).split('.');
  return tokenParts[1] ? JSON.parse(atob(tokenParts[1])) : {};
};

export const setAuthToken = (token: string) => {
  // TODO: Update to a more secure method for storing token
  localStorage.setItem(AUTH_TOKEN, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};

// DEPRECATED
export const getAnonToken = async () => {
  const token = localStorage.getItem(ANON_TOKEN);
  if (!token) {
    const jwt = await anonymousJWT();
    setAnonToken(jwt);
    return jwt;
  }
  return token;
};

// DEPRECATED
export const setAnonToken = (token: string) => {
  localStorage.setItem(ANON_TOKEN, token);
};
