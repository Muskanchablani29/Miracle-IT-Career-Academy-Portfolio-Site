import React, { createContext, useState, useEffect, useRef } from 'react';
import { userAxiosInstance } from '../api';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Initialize loading as false to remove loading animation
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return; // Prevent double invocation in Strict Mode
    let isMounted = true;
    
    const restoreUser = async () => {
      const access = localStorage.getItem('access');
      const role = localStorage.getItem('role');
      console.log('Restoring user session, access token:', access);
      
      if (access) {
        try {
          // Set user immediately from localStorage to avoid loading state
          if (role) {
            const username = localStorage.getItem('username') || 'User';
            setUser({ role, username });
            console.log('User set from localStorage immediately:', { role, username });
          }
          
          // Fetch profile in background to verify token and update user info
          const profilePromise = userAxiosInstance.get('profile/', { timeout: 3000 });
          const profile = await profilePromise;
          
          console.log('Profile fetched:', profile.data);
          const username = profile.data.username || null;
          const fetchedRole = profile.data.role;
          
          // Update role in localStorage if it's different
          if (fetchedRole && fetchedRole !== role) {
            localStorage.setItem('role', fetchedRole);
          }
          
          if (isMounted) {
            setUser({ role: fetchedRole || role, username });
            console.log('User updated in context:', { role: fetchedRole || role, username });
          }
        } catch (error) {
          console.error('Error restoring user session:', error);
          // Handle both authentication errors and timeouts
          if (error.response?.status === 401 || error.code === 'ECONNABORTED') {
            console.log('Authentication error or timeout, logging out');
            if (isMounted) {
              setUser(null);
              console.log('User cleared in context due to auth error or timeout');
            }
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('role');
          } else {
            // For other errors, keep the user logged in with minimal data from localStorage
            // We already set this at the beginning, so no need to set again
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          console.log('No access token found, user set to null');
        }
      }
    };
    
    restoreUser();
    
    return () => {
      isMounted = false;
      effectRan.current = true;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
