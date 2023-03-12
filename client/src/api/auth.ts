import { setAuthToken } from '../utils/auth';
import { authApi } from '.';

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
    data: { jwt, profileId }
  } = await authApi.login({
    username: email,
    password
  });
  setAuthToken(jwt);
  return profileId;
};

export const updateEmail = async (userId: string, email: string) =>
  await authApi.updateEmail({
    uuid: userId,
    email
  });

export const updatePassword = async (userId: string, password: string) =>
  await authApi.updatePassword({
    uuid: userId,
    password
  });

export const forgotPassword = async (email: string) =>
  await authApi.forgotPassword(email);

export const verifyEmail = async (userId: string) =>
  await authApi.verifyEmail(userId);

export const signup = async (
  name: string,
  organization: string,
  website: string,
  tag: string,
  email: string,
  password: string,
  permissionIds: string[],
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean
) =>
  await authApi.user({
    name,
    organization,
    website,
    tag,
    email,
    password,
    permissionIds,
    hasAcceptedTerms,
    hasAcceptedNewsletter
  });
