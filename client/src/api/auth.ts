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
  return await authApi.updateEmail({
    uuid: userId,
    email,
  });
};

export const updatePassword = async (
  newPassword: string,
  currentPassword?: string
) => {
  return await authApi.updatePassword({
    currentPassword,
    newPassword,
  });
};

export const forgotPassword = async (email: string) => {
  const anonToken = await anonymousJWT()
  return await authApi.forgotPassword({ email }, { headers: { Authorization: `Bearer ${anonToken}`}});
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
