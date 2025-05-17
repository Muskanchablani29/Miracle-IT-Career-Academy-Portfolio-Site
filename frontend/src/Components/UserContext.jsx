import React, { createContext, useState, useEffect } from 'react';
import axios from '../api';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const access = localStorage.getItem('access');
      const role = localStorage.getItem('role');
      
      if (access) {
        try {
          // Optionally fetch profile to verify token and get user info
          const profile = await axios.get('profile/');
          const username = profile.data.username || null;
          const fetchedRole = profile.data.role;
          
          // Update role in localStorage if it's different
          if (fetchedRole && fetchedRole !== role) {
            localStorage.setItem('role', fetchedRole);
          }
          
          setUser({ role: fetchedRole || role, username });
        } catch (error) {
          console.error('Error restoring user session:', error);
          // If we have a role in localStorage, use it as fallback
          if (role) {
            setUser({ role, username: null });
          } else {
            setUser(null);
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('role');
          }
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
