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

  /**
   * Check if the user is logged in when the component mounts.  This function
   * also will request a new token if the user refreshes their page and the previous
   * token has expired.
   */
  useEffect(() => {
    const checkIsUserLoggedIn = async () => {
      const isLoggedIn = await isAuthed();
      setIsLoggedIn(isLoggedIn);

      if (!isLoggedIn) {
        if (hasSessionToken()) {
          logout();
        }

        setIsLoggedIn(false);
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
