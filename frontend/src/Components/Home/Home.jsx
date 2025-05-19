import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Homeone from './Homeone.jsx';
import Hometwo from './Hometwo.jsx';
import Homethree from './Homethree.jsx';
import Homefour from './Homefour.jsx';
import Homefive from './Homefive.jsx';
import AdminSetup from './AdminSetup.jsx';

export default function Home() {
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem('access');
    const role = localStorage.getItem('role');

    if (access && role) {
      if (role === 'student') {
        setRedirectPath('/student');
      } else if (role === 'faculty') {
        setRedirectPath('/faculty');
      } else if (role === 'admin') {
        setRedirectPath('/admin');
      }
    }
  }, []);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <>
      <Homeone />
      {/* <Hometwo /> */}
      <Homethree />
      <Homefour />
      <Homefive />
      <AdminSetup />
    </>
  );
}