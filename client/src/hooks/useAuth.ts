import { useEffect, useState } from 'react';
import { isAuthed } from 'utils/auth';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await isAuthed();
      setIsLoggedIn(true);
    };
    checkAuth();
  });

  return {
    isLoggedIn
  };
};

export default useAuth;
