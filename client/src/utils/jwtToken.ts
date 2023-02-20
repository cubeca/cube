import { JWT_TOKEN_KEY } from 'constants/storageKeys';

export const getToken = () => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

// TODO: Update to a more secure method for storing token
export const setToken = (jwtToken: string) => {
  localStorage.setItem(JWT_TOKEN_KEY, jwtToken);
};
