import { setAuthToken } from '../utils/auth';
import { authApi } from './httpClient';

export const anonymousJWT = async () => {
  const {
    data: { jwt }
  } = await authApi.anonymousJWT({
    anonymous: true
  });
  return jwt;
};

export const login = async (email: string, password: string) => {
  const {
    data: { jwt }
  } = await authApi.login(
    {
      username: email,
      password
    }
  );
  setAuthToken(jwt);
  return jwt;
};

export const updateEmail = async (userId: string, email: string) => {
  return await authApi.updateEmail(
    {
      uuid: userId,
      email
    }
  );
};

export const updatePassword = async (userId: string, password: string) => {
  return await authApi.updatePassword(
    {
      uuid: userId,
      password
    }
  );
};

export const forgotPassword = async (email: string) => {
  return await authApi.forgotPassword(email);
};

export const verifyEmail = async (userId: string) => {
  return await authApi.verifyEmail(userId);
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  permissionIds: string[],
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean
) => {
  return await authApi.user(
    {
      name,
      email,
      password,
      permissionIds,
      hasAcceptedTerms,
      hasAcceptedNewsletter
    }
  );
};
