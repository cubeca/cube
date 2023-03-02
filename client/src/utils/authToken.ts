import { anonymousJWT } from 'api/auth';
import { JWT_AUTH_TOKEN_KEY } from 'constants/storageKeys';

export const getAuthToken = async ():Promise<string> => {
  let jwt = localStorage.getItem(JWT_AUTH_TOKEN_KEY);
  if (!jwt) {
    jwt = await anonymousJWT();
    setAuthToken(jwt || '');
  }
  return jwt;
};

// TODO: Update to a more secure method for storing tokens
export const setAuthToken = (jwtToken: string) => {
  localStorage.setItem(JWT_AUTH_TOKEN_KEY, jwtToken);
};

export const getAuthTokenPayload = async ():Promise<Record<string, unknown>> => {
  const tokenParts = (await getAuthToken()).split('.');
  return tokenParts[1] ? JSON.parse(atob(tokenParts[1])) : {};
};
