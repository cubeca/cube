import { getAuthToken, setAuthToken, setProfileId } from '../utils/auth';
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
    data: { jwt, user }
  } = await authApi.login({
    email,
    password
  });
  setAuthToken(jwt);
  if ((user as any).profile_id) setProfileId((user as any).profile_id);
  return user;
};

export const updateEmail = async (userId: string, email: string) => {
  const token = await getAuthToken();
  return await authApi.updateEmail({
    uuid: userId,
    email,
    token: token || ''
  });
};

export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const token = await getAuthToken();
  return await authApi.updatePassword({
    uuid: userId,
    currentPassword,
    newPassword,
    token: token || ''
  });
};

export const forgotPassword = async (email: string) => {
  return await authApi.forgotPassword({ email });
};

export const verifyEmail = async (userId: string) => {
  // await authApi.verifyEmail(userId);
};

export const creatorSignup = async (
  name: string,
  organization: string,
  website: string,
  tag: string,
  email: string,
  password: string,
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
    hasAcceptedTerms,
    hasAcceptedNewsletter
  });

export const userSignup = async (
  name: string,
  email: string,
  password: string,
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean
) =>
  await authApi.user({
    name,
    email,
    password,
    hasAcceptedTerms,
    hasAcceptedNewsletter
  });
