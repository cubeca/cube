import { useContext, useEffect, useState } from 'react';
import { isAuthed, removeAuthToken } from 'utils/auth';
import { login as authLogin } from 'api/auth';
import { UserContext } from 'providers/UserProvider';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await isAuthed();
      setIsLoggedIn(isLoggedIn && user?.has_verified_email);
    };
    checkAuth();
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
