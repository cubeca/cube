import { useContext, useEffect, useState } from 'react';
import {
  getAnonymousToken,
  getAuthToken,
  getAuthTokenPayload,
  hasSessionToken,
  isAuthed,
  removeAuthToken
} from 'utils/auth';
import { login as authLogin } from 'api/auth';
import { UserContext } from 'providers/UserProvider';
import { redirect } from 'react-router-dom';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    // const checkAuth = async () => {
    //   const isLoggedIn = await isAuthed();
    //   setIsLoggedIn(isLoggedIn);
    // };

    // const hasValidSession = () => {
    //   console.log('isloggedion', isLoggedIn);
    // };

    // checkAuth();
    // hasValidSession();

    const checkIsUserLoggedIn = async () => {
      const isLoggedIn = await isAuthed();
      setIsLoggedIn(isLoggedIn);

      if (!isLoggedIn) {
        if (await hasSessionToken()) {
          logout();
          redirect('/login');
          await getAnonymousToken();
        }
      }

      console.log('token', await getAuthTokenPayload());
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
