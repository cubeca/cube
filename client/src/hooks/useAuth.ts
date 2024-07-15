/**
 * `useAuth` is a custom React hook that manages authentication state. It provides functionality to check if a user is logged in, 
 * log in a user, and log out a user. The hook uses a combination of local state management and side effects to interact with auth-related 
 * utilities and API services.

 * Upon initialization, the hook checks if the user is authenticated by calling `isAuthed`. If the user is not authenticated and a session token exists, 
 * it attempts to log out the user and then retrieves an anonymous token. This process ensures that the user state is correctly set based on the 
 * authentication status.

 * The hook exposes two main functions, `login` and `logout`, which allow for logging in and logging out the user, respectively. The `login` function 
 * takes an email and password, and uses the `authLogin` function from the `api/auth` module to authenticate the user. The `logout` function clears the 
 * authentication token and updates the `isLoggedIn` state to `false`.

 * @returns {Object} An object containing the `isLoggedIn` state to indicate the user's authentication status, and functions `login` and `logout` for 
 * managing user authentication.
 */

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
