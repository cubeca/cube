import { anonymousJWT } from 'api/auth';

const AUTH_TOKEN = 'AUTH_TOKEN';
const ANON_TOKEN = 'ANON_TOKEN';

export const getAuthToken = () => {
  localStorage.getItem(AUTH_TOKEN);
};

export const setAuthToken = (token: string) => {
  // TODO: Update to a more secure method for storing token
  localStorage.setItem(AUTH_TOKEN, token);
};

export const getAnonToken = async () => {
  const token = localStorage.getItem(ANON_TOKEN);
  if (!token) {
    const response = await anonymousJWT();
    setAnonToken(response.data.jwt);
    return response.data.jwt;
  }
  return token;
};

export const setAnonToken = (token: string) => {
  localStorage.setItem(ANON_TOKEN, token);
};
