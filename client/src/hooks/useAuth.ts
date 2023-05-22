import { useEffect, useState } from 'react';
import { isAuthed } from 'utils/auth';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await isAuthed();
      setIsLoggedIn(isLoggedIn);
    };
    checkAuth();
  });

  return {
    isLoggedIn
  };
};

export default useAuth;
