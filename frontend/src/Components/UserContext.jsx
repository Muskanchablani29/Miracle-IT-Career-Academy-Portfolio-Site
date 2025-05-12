import React, { createContext, useState, useEffect } from 'react';
import axios from '../api';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
          // If token invalid or error, clear user and tokens
          setUser(null);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      }
    };
    restoreUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
