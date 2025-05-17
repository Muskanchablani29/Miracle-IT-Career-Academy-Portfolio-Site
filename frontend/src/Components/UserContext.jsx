import React, { createContext, useState, useEffect } from 'react';
import axios from '../api';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const access = localStorage.getItem('access');
      if (access) {
        try {
          // Optionally fetch profile to verify token and get user info
          const profile = await axios.get('profile/');
          const role = profile.data.role;
          const username = profile.data.username || null;
          setUser({ role, username });
        } catch (error) {
          console.error('Error restoring user session:', error);
          // Remove hardcoded user fallback for production
          setUser(null);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      }
      setLoading(false);
    };
    restoreUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
