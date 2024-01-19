import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
  setProfileId
} from '../utils/auth';
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
  removeAuthToken();
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
    email
  });
};

export const updatePassword = async ({
  newPassword,
  currentPassword,
  token
}: {
  newPassword: string;
  currentPassword?: string;
  token?: string;
}) => {
  const headers = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : undefined;
  return await authApi.updatePassword(
    {
      currentPassword,
      newPassword
    },
    headers
  );
};

export const forgotPassword = async (email: string) => {
  const anonToken = await anonymousJWT();
  return await authApi.forgotPassword(
    { email },
    { headers: { Authorization: `Bearer ${anonToken}` } }
  );
};

export const creatorSignup = async (
  name: string,
  organization: string,
  website: string,
  tag: string,
  email: string,
  password: string,
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean,
  isOver18: boolean
) =>
  await authApi.user({
    name,
    organization,
    website,
    tag,
    email,
    password,
    hasAcceptedTerms,
    hasAcceptedNewsletter,
    isOver18
  });

export const userSignup = async (
  name: string,
  email: string,
  password: string,
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean,
  isOver18: boolean
) =>
  await authApi.user({
    name,
    email,
    password,
    hasAcceptedTerms,
    hasAcceptedNewsletter,
    isOver18
  });

export const resendEmailVerification = async (email: string) => {
  const authToken = await getAuthToken();
  return await authApi.resendEmailVerification(
    { email },
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
};

export const contactUs = async (
  name: string,
  email: string,
  desc: string,
  ticketId: string
) => {
  const authToken = await getAuthToken();
  return await authApi.contactUs(
    { name, email, desc, ticketId },
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
};
