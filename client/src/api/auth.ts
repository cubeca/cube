import { getAnonToken, getAuthToken, setAuthToken } from 'utils/authToken';
import { authApi } from './httpClient';

export const anonymousJWT = async () => {
  const api = await authApi.anonymousJWT({
    anonymous: true
  });
  const {
    data: { jwt }
  } = await api();
  return jwt;
};

export const login = async (email: string, password: string) => {
  const anonToken = await getAnonToken();

  const api = await authApi.login(
    {
      username: email,
      password
    },
    {
      headers: {
        authorization: `BEARER ${anonToken}`
      }
    }
  );
  const {
    data: { jwt }
  } = await api();
  setAuthToken(jwt);
  return jwt;
};

export const updateEmail = async (uuid: string, email: string) => {
  const api = await authApi.updateEmail(
    {
      uuid,
      email
    },
    {
      headers: {
        authorization: `BEARER ${getAuthToken()}`
      }
    }
  );
  return await api();
};

export const updatePassword = async (uuid: string, password: string) => {
  const api = await authApi.updatePassword(
    {
      uuid,
      password
    },
    {
      headers: {
        authorization: `BEARER ${getAuthToken()}`
      }
    }
  );
  return await api();
};

export const forgotPassword = async (email: string) => {
  const anonToken = await getAnonToken();
  const api = await authApi.forgotPassword(email, {
    headers: {
      authorization: `BEARER ${anonToken}`
    }
  });
  return await api();
};

export const verifyEmail = async (uuid: string) => {
  const anonToken = await getAnonToken();
  const api = await authApi.verifyEmail(uuid, {
    headers: {
      authorization: `BEARER ${anonToken}`
    }
  });
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
  const anonToken = await getAnonToken();
  const api = await authApi.user(
    {
      name,
      email,
      password,
      permissionIds,
      hasAcceptedTerms,
      hasAcceptedNewsletter
    },
    {
      headers: {
        authorization: `BEARER ${anonToken}`
      }
    }
  );
  return await api();
};
