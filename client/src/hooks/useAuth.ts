import { useEffect, useState } from 'react';
import {
  getAnonymousToken,
  hasSessionToken,
  isAuthed,
  removeAuthToken
} from 'utils/auth';
import { login as authLogin } from 'api/auth';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkIsUserLoggedIn = async () => {
      const isLoggedIn = await isAuthed();
      setIsLoggedIn(isLoggedIn);

      if (!isLoggedIn) {
        if (hasSessionToken()) {
          logout();
        }

        await getAnonymousToken();
      }
    };

    checkIsUserLoggedIn();
  });

  const login = async (email: string, password: string) => {
    await authLogin(email, password);
  };

  const logout = () => {
    setIsLoggedIn(false);
    removeAuthToken();
  };

  return {
    login,
    logout,
    isLoggedIn
  };
};

export default useAuth;
