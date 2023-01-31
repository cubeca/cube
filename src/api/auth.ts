import { authApi } from './httpClient';

export const login = async (email: string, password: string) => {
  const api = await authApi.login({
    email,
    password
  });
  return await api();
};

export const anonymousJWT = async () => {
  const api = await authApi.anonymousJWT({
    anonymous: true
  });
  return await api();
};

export const updateEmail = async (uuid: string, email: string) => {
  const api = await authApi.updateEmail({
    uuid,
    email
  });
  return await api();
};

export const updatePassword = async (uuid: string, password: string) => {
  const api = await authApi.updatePassword({
    uuid,
    password
  });
  return await api();
};

export const forgotPassword = async (email: string) => {
  const api = await authApi.forgotPassword(email);
  return await api();
};

export const verifyEmail = async (uuid: string) => {
  const api = await authApi.verifyEmail(uuid);
  return await api();
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  permissionIds: string[],
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean
) => {
  const api = await authApi.createUser({
    name,
    email,
    password,
    permissionIds,
    hasAcceptedTerms,
    hasAcceptedNewsletter
  });
  return await api();
};
