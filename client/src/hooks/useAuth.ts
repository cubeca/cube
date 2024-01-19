import { useContext, useEffect, useState } from 'react';
import {
  getAnonymousToken,
  hasSessionToken,
  isAuthed,
  removeAuthToken
} from 'utils/auth';
import { login as authLogin } from 'api/auth';
import { UserContext } from 'providers/UserProvider';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const checkIsUserLoggedIn = async () => {
      const isLoggedIn = await isAuthed();
      setIsLoggedIn(isLoggedIn);

      if (!isLoggedIn) {
        if (await hasSessionToken()) {
          logout();
        }

        await getAnonymousToken();
      }
    };

    checkIsUserLoggedIn();
  });

  const login = async (email: string, password: string) => {
    const user = await authLogin(email, password);
    setUser(user);
    return user;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(undefined);
    removeAuthToken();
  };

  return {
    login,
    logout,
    isLoggedIn
  };
};

export default useAuth;
