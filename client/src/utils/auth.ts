import { anonymousJWT } from 'api/auth';

const AUTH_TOKEN = 'AUTH_TOKEN';

export const getAuthToken = async (): Promise<string | null> => {
  let jwt = localStorage.getItem(AUTH_TOKEN);
  if (!jwt) {
    jwt = await anonymousJWT();
    setAuthToken(jwt || '');
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

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};
