import React, { createContext, useState, useEffect, useRef } from 'react';
import { userAxiosInstance } from '../api';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return; // Prevent double invocation in Strict Mode
    let isMounted = true;
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log('UserContext: Loading timeout reached, forcing loading to false');
        setLoading(false);
        
        // Try to restore user from token if possible
        const access = localStorage.getItem('access');
        const role = localStorage.getItem('role');
        if (access && role) {
          console.log('UserContext: Setting user from localStorage after timeout');
          setUser({ role, username: 'User' });
        }
      }
    }, 5000);
    
    const restoreUser = async () => {
      const access = localStorage.getItem('access');
      const role = localStorage.getItem('role');
      console.log('Restoring user session, access token:', access);
      
      if (access) {
        try {
          // Optionally fetch profile to verify token and get user info
          const profile = await userAxiosInstance.get('profile/');
          console.log('Profile fetched:', profile.data);
          const username = profile.data.username || null;
          const fetchedRole = profile.data.role;
          
          // Update role in localStorage if it's different
          if (fetchedRole && fetchedRole !== role) {
            localStorage.setItem('role', fetchedRole);
          }
          
          if (isMounted) {
            setUser({ role: fetchedRole || role, username });
          }
        } catch (error) {
          console.error('Error restoring user session:', error);
          // Only clear tokens if it's an authentication error (401)
          if (error.response && error.response.status === 401) {
            console.log('Authentication error, logging out');
            if (isMounted) setUser(null);
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('role');
          } else {
            // For other errors (like network issues), try to keep the user logged in
            // Use token data to create a minimal user object
            try {
              // Parse the JWT token to get basic user info
              const tokenParts = access.split('.');
              if (tokenParts.length === 3) {
                const tokenPayload = tokenParts[1];
                const base64 = tokenPayload.replace(/-/g, '+').replace(/_/g, '/');
                const tokenData = JSON.parse(atob(base64));
                
                // Extract role from token if available, or use a default
                const role = tokenData.role || 'student';
                const username = tokenData.username || 'User';
                console.log('Restored user from token:', { role, username });
                if (isMounted) setUser({ role, username });
              }
            } catch (tokenError) {
              console.error('Failed to parse token:', tokenError);
              // Don't clear tokens on token parsing error
              // This allows the token refresh mechanism to try again later
            }
          }
        } finally {
          // Always set loading to false when done
          if (isMounted) setLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };
    
    restoreUser();
    
    return () => {
      isMounted = false;
      effectRan.current = true;
      clearTimeout(timeoutId);
    };
  }, [loading]);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
