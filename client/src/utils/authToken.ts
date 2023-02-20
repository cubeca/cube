import { anonymousJWT } from 'api/auth';
import { JWT_AUTH_TOKEN_KEY, JWT_ANON_TOKEN_KEY } from 'constants/storageKeys';

export const getAuthToken = () => {
  return localStorage.getItem(JWT_AUTH_TOKEN_KEY) || '';
};

// TODO: Update to a more secure method for storing token
export const setAuthToken = (jwtToken: string) => {
  localStorage.setItem(JWT_AUTH_TOKEN_KEY, jwtToken);
};

export const getAnonToken = async () => {
  let jwt = localStorage.getItem(JWT_ANON_TOKEN_KEY);
  if (!jwt) {
    jwt = await anonymousJWT();
    setAnonToken(jwt || '');
  }
  return jwt;
};

// TODO: Update to a more secure method for storing token
export const setAnonToken = (jwtToken: string) => {
  localStorage.setItem(JWT_ANON_TOKEN_KEY, jwtToken);
};
